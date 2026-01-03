// src/ai/gemini.ts
// Updated to use centralized RateLimitService

import { rateLimitService } from '../services/rateLimitService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface GeminiResponse {
  content: string;
  code?: string;
  fromCache?: boolean;
}

// Simple cache for identical responses
const responseCache = new Map<string, string>();
const CACHE_SIZE_LIMIT = 50; // Keep only 50 cached responses

/**
 * Call Gemini API with centralized rate limiting
 * 
 * @param prompt The user's question/prompt
 * @param context Optional context about the problem
 * @returns Response with content and optional code
 */
export async function callGemini(
  prompt: string,
  context: string = ''
): Promise<GeminiResponse> {
  if (!API_KEY) {
    return {
      content:
        '⚠️ ERROR: VITE_GEMINI_API_KEY not set in .env.local\n\n' +
        'Setup Instructions:\n' +
        '1. Visit: https://aistudio.google.com/app/apikey\n' +
        '2. Create a FREE API key\n' +
        '3. Add to .env.local: VITE_GEMINI_API_KEY=your_key_here\n' +
        '4. Restart dev server (npm run dev)\n\n' +
        'For now, please set up the API key to use the AI tutor.',
    };
  }

  // 1. Generate unique request key
  const requestKey = rateLimitService.generateRequestKey(prompt, context);

  // 2. Check cache FIRST (prevents API call entirely)
  const cacheKey = `${context.substring(0, 100)}_${prompt.substring(0, 100)}`;
  if (responseCache.has(cacheKey)) {
    console.log('✓ Returning cached response');
    return {
      ...extractCodeBlocks(responseCache.get(cacheKey)!),
      fromCache: true,
    };
  }

  // 3. Check rate limit
  const { allowed, remaining, waitMs } = rateLimitService.canMakeRequest(requestKey);

  if (!allowed) {
    const seconds = Math.ceil(waitMs / 1000);
    return {
      content:
        `⏱️ Rate Limited\n\n` +
        `Please wait ${seconds} seconds before the next request.\n\n` +
        `This prevents API overload. The Gemini API has a global limit of 15 requests/minute.\n\n` +
        `💡 Pro Tip: Ask longer, more detailed questions to get better answers and use fewer requests!`,
    };
  }

  // 4. Mark as in-flight (prevents duplicate requests)
  rateLimitService.markInFlight(requestKey);

  try {
    // 5. Build the request
    const fullPrompt = `You are an expert competitive programming tutor helping students understand coding problems.

${context ? `\nPROBLEM CONTEXT:\n${context}\n` : ''}

STUDENT'S QUESTION:
"${prompt}"

Provide:
1. Clear educational explanation (2-3 paragraphs max)
2. Code examples (JavaScript/TypeScript preferred) when relevant
3. Time and space complexity analysis
4. Key insights and edge cases to consider
5. Keep response concise and focused

Answer:`;

    // 6. Make API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
          ],
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    // 7. Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);

      // Remove from in-flight on error
      rateLimitService.removeInflight(requestKey);

      if (response.status === 429) {
        return {
          content:
            `⏱️ API Rate Limited (429)\n\n` +
            `The Gemini API has a global rate limit of 15 requests/minute.\n\n` +
            `Our system enforces 12 requests/minute to stay safely under the limit.\n\n` +
            `Please wait a moment and try again.`,
        };
      }

      if (response.status === 401 || response.status === 403) {
        return {
          content:
            `❌ Invalid API Key\n\n` +
            `Your VITE_GEMINI_API_KEY is invalid or expired.\n\n` +
            `Steps to fix:\n` +
            `1. Visit: https://aistudio.google.com/app/apikey\n` +
            `2. Delete the old key\n` +
            `3. Create a NEW key\n` +
            `4. Update .env.local file\n` +
            `5. Restart dev server (npm run dev)`,
        };
      }

      if (response.status === 500) {
        return {
          content:
            `⚠️ Google API Server Error (500)\n\n` +
            `The Gemini API is temporarily unavailable.\n\n` +
            `Try again in a few moments.`,
        };
      }

      return {
        content: `⚠️ API Error (${response.status}): ${
          errorData.error?.message || 'Unknown error'
        }`,
      };
    }

    const data = await response.json();

    // 8. Extract response
    if (
      data.candidates &&
      data.candidates[0]?.content?.parts?.[0]?.text
    ) {
      const aiText = data.candidates[0].content.parts[0].text;

      // 9. Cache the response
      responseCache.set(cacheKey, aiText);
      // Keep cache size manageable
      if (responseCache.size > CACHE_SIZE_LIMIT) {
        const firstKey = responseCache.keys().next().value;
        responseCache.delete(firstKey);
      }

      // 10. Record successful request
      rateLimitService.recordRequest(requestKey);

      return extractCodeBlocks(aiText);
    }

    rateLimitService.removeInflight(requestKey);
    return {
      content: '⚠️ Unexpected response format from Gemini API',
    };
  } catch (err) {
    console.error('Gemini API Error:', err);

    rateLimitService.removeInflight(requestKey);

    if (err instanceof Error && err.name === 'AbortError') {
      return {
        content:
          `⏱️ Request Timeout\n\n` +
          `The API took too long to respond (30 seconds).\n\n` +
          `This might mean:\n` +
          `- The API is experiencing high load\n` +
          `- Your internet connection is slow\n` +
          `- Try again in a moment`,
      };
    }

    return {
      content: `⚠️ Network Error: ${
        err instanceof Error ? err.message : 'Unknown error occurred'
      }`,
    };
  }
}

/**
 * Extract code blocks from AI response
 * Fixed regex to properly capture code content
 */
function extractCodeBlocks(text: string): {
  content: string;
  code?: string;
} {
  // Match triple backticks with optional language identifier
  // Captures everything between the backticks
  const codeRegex = /``````/;
  const match = text.match(codeRegex);

  if (match && match[1]) {
    const code = match[1].trim();
    // Remove the code block from content
    const content = text.replace(match[0], '\n[👇 CODE BELOW]\n').trim();
    return { content, code };
  }

  return { content: text };
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus() {
  return rateLimitService.getStatus();
}

/**
 * Reset rate limiter (for testing/debugging only)
 */
export function resetRateLimit() {
  rateLimitService.reset();
  responseCache.clear();
}

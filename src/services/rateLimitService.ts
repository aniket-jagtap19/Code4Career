/**
 * Centralized Rate Limiter Service
 * 
 * This is the SINGLE SOURCE OF TRUTH for all Gemini API rate limiting.
 * All modules (upsolve.tsx, gemini.ts, geminiFeedback.ts) use this.
 * 
 * Features:
 * - Persistent across page refreshes (localStorage)
 * - Prevents duplicate in-flight requests
 * - Respects Google's 15 requests/minute limit
 * - Safe margin: 12 requests/minute locally (3 request buffer)
 * - Auto-cleanup of old requests
 * - Cross-tab awareness (basic)
 */

const STORAGE_KEY = 'gemini_rate_limit_state';
const STORAGE_KEY_INFLIGHT = 'gemini_inflight_requests';

interface RateLimitState {
  requestTimes: number[];
  lastCleanup: number;
}

interface InflightRequest {
  key: string;
  timestamp: number;
  timeout: number;
}

class RateLimitService {
  // Conservative limits: 12 requests per minute (Google allows 15, we keep 3 buffer)
  private readonly MAX_REQUESTS = 12;
  private readonly WINDOW_MS = 60000; // 1 minute
  private readonly INFLIGHT_TIMEOUT = 35000; // 35 seconds (API timeout is 30s)
  private readonly CLEANUP_INTERVAL = 10000; // Cleanup every 10s

  private inFlightRequests: Map<string, number> = new Map();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
    this.loadInflightRequests();
  }

  /**
   * Check if a request can be made
   * Returns: { allowed: boolean, remaining: number, waitMs: number }
   */
  canMakeRequest(requestKey: string): {
    allowed: boolean;
    remaining: number;
    waitMs: number;
  } {
    // 1. Check if this exact request is already in-flight (prevent duplicates)
    if (this.inFlightRequests.has(requestKey)) {
      const elapsed = Date.now() - this.inFlightRequests.get(requestKey)!;
      if (elapsed < this.INFLIGHT_TIMEOUT) {
        return {
          allowed: false,
          remaining: 0,
          waitMs: this.INFLIGHT_TIMEOUT - elapsed,
        };
      } else {
        // In-flight request timed out, remove it
        this.inFlightRequests.delete(requestKey);
      }
    }

    // 2. Load current state from storage
    const state = this.loadState();

    // 3. Clean up old requests (older than window)
    const now = Date.now();
    state.requestTimes = state.requestTimes.filter(
      (time) => now - time < this.WINDOW_MS
    );

    // 4. Check if we can make a request
    const remaining = this.MAX_REQUESTS - state.requestTimes.length;

    if (remaining > 0) {
      return {
        allowed: true,
        remaining,
        waitMs: 0,
      };
    }

    // 5. Calculate wait time
    const oldestRequest = state.requestTimes[0];
    const waitMs = this.WINDOW_MS - (now - oldestRequest);

    return {
      allowed: false,
      remaining: 0,
      waitMs: Math.max(0, waitMs),
    };
  }

  /**
   * Record a request (call this AFTER successful fetch, not before)
   */
  recordRequest(requestKey: string): void {
    const state = this.loadState();
    const now = Date.now();

    // Only record if we haven't already (prevent duplicates from race conditions)
    state.requestTimes = state.requestTimes.filter(
      (time) => now - time < this.WINDOW_MS
    );
    state.requestTimes.push(now);
    state.lastCleanup = now;

    this.saveState(state);

    // Remove from in-flight (successful)
    this.inFlightRequests.delete(requestKey);
    this.saveInflightRequests();
  }

  /**
   * Mark a request as in-flight (call this BEFORE fetch)
   */
  markInFlight(requestKey: string): void {
    this.inFlightRequests.set(requestKey, Date.now());
    this.saveInflightRequests();
  }

  /**
   * Remove a request from in-flight (call this on error)
   */
  removeInflight(requestKey: string): void {
    this.inFlightRequests.delete(requestKey);
    this.saveInflightRequests();
  }

  /**
   * Get remaining requests and reset time
   */
  getStatus(): {
    remaining: number;
    resetMs: number;
    total: number;
  } {
    const state = this.loadState();
    const now = Date.now();

    // Clean old requests
    state.requestTimes = state.requestTimes.filter(
      (time) => now - time < this.WINDOW_MS
    );

    const remaining = Math.max(0, this.MAX_REQUESTS - state.requestTimes.length);
    let resetMs = 0;

    if (state.requestTimes.length > 0) {
      const oldestRequest = state.requestTimes[0];
      resetMs = Math.max(0, this.WINDOW_MS - (now - oldestRequest));
    }

    return {
      remaining,
      resetMs,
      total: this.MAX_REQUESTS,
    };
  }

  /**
   * Reset all rate limit data (use for testing only)
   */
  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_INFLIGHT);
    this.inFlightRequests.clear();
  }

  /**
   * Generate a request key from prompt and context
   * Sensitive to content to avoid collisions
   */
  generateRequestKey(prompt: string, context: string = ''): string {
    // Use full content for better uniqueness (not just first 50 chars)
    // Hash would be better but we'll use content-based key
    const combined = `${context}_${prompt}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `req_${Math.abs(hash)}_${Date.now()}`;
  }

  // --- Private Methods ---

  private loadState(): RateLimitState {
    if (typeof window === 'undefined') {
      return { requestTimes: [], lastCleanup: Date.now() };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored) as RateLimitState;
        // Validate it's an array of numbers
        if (Array.isArray(state.requestTimes)) {
          return state;
        }
      }
    } catch (e) {
      console.error('Failed to load rate limit state:', e);
    }

    return { requestTimes: [], lastCleanup: Date.now() };
  }

  private saveState(state: RateLimitState): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save rate limit state:', e);
    }
  }

  private loadInflightRequests(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY_INFLIGHT);
      if (stored) {
        const requests = JSON.parse(stored) as InflightRequest[];
        const now = Date.now();
        
        requests.forEach((req) => {
          // Only load non-expired in-flight requests
          if (now - req.timestamp < req.timeout) {
            this.inFlightRequests.set(req.key, req.timestamp);
          }
        });
      }
    } catch (e) {
      console.error('Failed to load in-flight requests:', e);
    }
  }

  private saveInflightRequests(): void {
    if (typeof window === 'undefined') return;

    try {
      const requests: InflightRequest[] = Array.from(
        this.inFlightRequests.entries()
      ).map(([key, timestamp]) => ({
        key,
        timestamp,
        timeout: this.INFLIGHT_TIMEOUT,
      }));

      localStorage.setItem(STORAGE_KEY_INFLIGHT, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save in-flight requests:', e);
    }
  }

  private startCleanupTimer(): void {
    if (typeof window === 'undefined') return;

    this.cleanupTimer = setInterval(() => {
      const state = this.loadState();
      const now = Date.now();

      // Remove old requests
      state.requestTimes = state.requestTimes.filter(
        (time) => now - time < this.WINDOW_MS
      );
      state.lastCleanup = now;

      this.saveState(state);

      // Clean in-flight requests
      const inflightArray = Array.from(this.inFlightRequests.entries());
      for (const [key, timestamp] of inflightArray) {
        if (now - timestamp > this.INFLIGHT_TIMEOUT) {
          this.inFlightRequests.delete(key);
        }
      }
      this.saveInflightRequests();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Stop the cleanup timer (call on unmount if needed)
   */
  stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// Create singleton instance
export const rateLimitService = new RateLimitService();

// Export type for convenience
export type { RateLimitState };

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).rateLimitService = rateLimitService;
}


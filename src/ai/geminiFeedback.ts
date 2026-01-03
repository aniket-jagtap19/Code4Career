import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { rateLimitService } from "../services/rateLimitService";
export const getAIFeedback = async ({
  uid,
  contestId,
  summary,
}: {
  uid: string;
  contestId: string;
  summary: string;
}) => {
  // Check rate limit FIRST
  const requestKey = rateLimitService.generateRequestKey(
    summary,
    `feedback_${contestId}`
  );
  const { allowed, waitMs } = rateLimitService.canMakeRequest(requestKey);

  if (!allowed) {
    throw new Error(
      `Rate limited: Please wait ${Math.ceil(waitMs / 1000)}s before requesting feedback`
    );
  }

  rateLimitService.markInFlight(requestKey);

  try {
    const fn = httpsCallable(functions, "generateAIFeedback");
    const res = await fn({
      uid,
      contestId,
      prompt: summary,
    });

    rateLimitService.recordRequest(requestKey);
    return res.data as { result: string; cached: boolean };
  } catch (error) {
    rateLimitService.removeInflight(requestKey);
    throw error;
  }
};

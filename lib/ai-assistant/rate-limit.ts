type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

export const checkRateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    });

    return {
      ok: true,
      remaining: limit - 1,
      resetAt: now + windowMs
    };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: current.resetAt
    };
  }

  current.count += 1;
  rateLimitStore.set(key, current);

  return {
    ok: true,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt
  };
};

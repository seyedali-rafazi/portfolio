interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleRecords() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, record] of ipRequestMap.entries()) {
    if (record.resetAt <= now) {
      ipRequestMap.delete(ip);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// 50 requests per hour (60 minutes)
const DEFAULT_LIMIT = 50;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in ms

/**
 * In-memory sliding rate limiter.
 * @param ip - Client identifier (IP address)
 * @param limit - Maximum allowed requests in the time window (default: 50)
 * @param windowMs - Time window in milliseconds (default: 1 hour)
 */
export function checkRateLimit(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS
): RateLimitResult {
  cleanupStaleRecords();

  const isDev = process.env.NODE_ENV === "development";
  // In development, be more generous with localhost
  const effectiveLimit =
    isDev && (ip === "127.0.0.1" || ip === "::1" || ip === "localhost")
      ? Math.max(limit, 200)
      : limit;

  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || record.resetAt <= now) {
    ipRequestMap.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      limit: effectiveLimit,
      remaining: effectiveLimit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= effectiveLimit) {
    return {
      allowed: false,
      limit: effectiveLimit,
      remaining: 0,
      resetSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    limit: effectiveLimit,
    remaining: effectiveLimit - record.count,
    resetSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Reset rate limit for a specific IP or all records
 */
export function resetRateLimit(ip?: string) {
  if (ip) {
    ipRequestMap.delete(ip);
  } else {
    ipRequestMap.clear();
  }
}

/**
 * Helper to extract client IP from Next.js Request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

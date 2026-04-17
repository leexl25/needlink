const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_SECRET = process.env.SESSION_SECRET || "demandly-secret-2024";

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const payload = {
    ts: Date.now(),
    rand: crypto.randomUUID(),
  };
  // Base64 encode + simple HMAC-like signature
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const sig = hashWithSecret(data);
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return false;
    const expectedSig = hashWithSecret(data);
    if (sig !== expectedSig) return false;
    const payload = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );
    // Session valid for 7 days
    if (Date.now() - payload.ts > 7 * 24 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

function hashWithSecret(data: string): string {
  // Simple hash for MVP — not cryptographically ideal but sufficient
  const combined = `${SESSION_SECRET}:${data}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export const SESSION_COOKIE_NAME = "demandly_admin_session";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

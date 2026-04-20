const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin123");
const SESSION_SECRET = process.env.SESSION_SECRET || "demandly-secret-2024";

if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
  console.error("FATAL: ADMIN_PASSWORD must be set in production");
}

export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  return password === ADMIN_PASSWORD;
}

async function signToken(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const payload = {
    ts: Date.now(),
    rand: crypto.randomUUID(),
  };
  const data = btoa(JSON.stringify(payload));
  const sig = await signToken(data);
  return `${data}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return false;
    const expectedSig = await signToken(data);
    if (sig.length !== expectedSig.length) return false;
    // Constant-time compare
    let mismatch = 0;
    for (let i = 0; i < sig.length; i++) {
      mismatch |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
    }
    if (mismatch !== 0) return false;
    const payload = JSON.parse(atob(data));
    if (Date.now() - payload.ts > 7 * 24 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_NAME = "demandly_admin_session";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

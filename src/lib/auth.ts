import crypto from "crypto";
import { cookies } from "next/headers";
import { readDataJson } from "./fs-data";

const SESSION_COOKIE = "honda-admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const AUTH_SECRET = process.env.AUTH_SECRET || "honda-car-dev-auth-secret";

interface UsersFile {
  users: { username: string; password: string }[];
}

interface SessionRecord {
  username: string;
  exp: number;
}

export function verifyCredentials(username: string, password: string): boolean {
  const { users } = readDataJson<UsersFile>("users.json");
  return users.some(
    (user) => user.username === username && user.password === password
  );
}

function sign(data: string) {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(data)
    .digest("base64url");
}

function createSessionToken(username: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function createSession(username: string) {
  return createSessionToken(username);
}

export function getSessionById(sessionId: string): SessionRecord | null {
  const [payload, signature] = sessionId.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload), "base64url");
  const received = Buffer.from(signature, "base64url");
  if (
    expected.length !== received.length ||
    !crypto.timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as SessionRecord;
    if (
      typeof session.username !== "string" ||
      typeof session.exp !== "number" ||
      session.exp < Date.now()
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function destroySession(_sessionId: string) {
  void _sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = getSessionById(sessionId);
  if (!session) return null;

  return { id: sessionId, username: session.username };
}

export function getSessionCookieOptions(sessionId: string) {
  return {
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function getClearSessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export { SESSION_COOKIE };

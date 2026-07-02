import crypto from "crypto";
import { cookies } from "next/headers";
import { readDataJson, writeDataJson } from "./fs-data";

const SESSION_COOKIE = "honda-admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

interface UsersFile {
  users: { username: string; password: string }[];
}

interface SessionRecord {
  username: string;
  exp: number;
}

interface SessionsFile {
  sessions: Record<string, SessionRecord>;
}

export function verifyCredentials(username: string, password: string): boolean {
  const { users } = readDataJson<UsersFile>("users.json");
  return users.some(
    (user) => user.username === username && user.password === password
  );
}

function readSessions(): SessionsFile {
  try {
    return readDataJson<SessionsFile>("sessions.json");
  } catch {
    return { sessions: {} };
  }
}

function writeSessions(data: SessionsFile) {
  const now = Date.now();
  const sessions = Object.fromEntries(
    Object.entries(data.sessions).filter(([, session]) => session.exp > now)
  );
  writeDataJson({ sessions }, "sessions.json");
}

function createSessionId() {
  return crypto.randomBytes(32).toString("base64url");
}

export function createSession(username: string) {
  const sessionId = createSessionId();
  const data = readSessions();

  data.sessions[sessionId] = {
    username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };

  writeSessions(data);
  return sessionId;
}

export function getSessionById(sessionId: string): SessionRecord | null {
  const data = readSessions();
  const session = data.sessions[sessionId];
  if (!session || session.exp < Date.now()) {
    if (session) {
      delete data.sessions[sessionId];
      writeSessions(data);
    }
    return null;
  }
  return session;
}

export function destroySession(sessionId: string) {
  const data = readSessions();
  if (data.sessions[sessionId]) {
    delete data.sessions[sessionId];
    writeSessions(data);
  }
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

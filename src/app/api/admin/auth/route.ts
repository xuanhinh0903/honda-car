import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSession,
  destroySession,
  getClearSessionCookieOptions,
  getSession,
  getSessionCookieOptions,
  verifyCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Vui lòng nhập tài khoản và mật khẩu" },
      { status: 400 }
    );
  }

  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { error: "Tài khoản hoặc mật khẩu không đúng" },
      { status: 401 }
    );
  }

  const sessionId = createSession(username);
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieOptions(sessionId));

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}

export async function DELETE() {
  const session = await getSession();
  if (session) {
    destroySession(session.id);
  }

  const cookieStore = await cookies();
  cookieStore.set(getClearSessionCookieOptions());
  return NextResponse.json({ ok: true });
}

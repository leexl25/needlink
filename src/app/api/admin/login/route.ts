import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json({ error: "请求无效" }, { status: 400 });
  }
}

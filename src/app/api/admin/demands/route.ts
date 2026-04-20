import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/admin-auth";

export async function PATCH(request: NextRequest) {
  // Independent auth check
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken || !verifySessionToken(sessionToken)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status || !["open", "building", "launched"].includes(status)) {
      return NextResponse.json({ error: "参数无效" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("demands")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "请求无效" }, { status: 400 });
  }
}

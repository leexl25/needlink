import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  // Independent auth check
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken || !verifySessionToken(sessionToken)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { name, description, launch_url, demand_id, users_count } = await request.json();

    if (!name || !description || !launch_url) {
      return NextResponse.json({ error: "请填写必填项" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("products").insert({
      name,
      description,
      launch_url,
      demand_id: demand_id || null,
      users_count: users_count || 0,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "请求无效" }, { status: 400 });
  }
}

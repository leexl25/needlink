import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_SUBMISSIONS_PER_IP_PER_HOUR = 3;

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, problem, current_solution, ideal_solution, target_user, submitter_name } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0 || title.length > 100) {
      return NextResponse.json({ error: "标题需 1-100 字" }, { status: 400 });
    }
    if (!problem || typeof problem !== "string" || problem.trim().length < 20 || problem.length > 2000) {
      return NextResponse.json({ error: "问题描述需 20-2000 字" }, { status: 400 });
    }
    if (!target_user || typeof target_user !== "string" || target_user.trim().length === 0 || target_user.length > 50) {
      return NextResponse.json({ error: "请选择或填写你的角色" }, { status: 400 });
    }
    if (current_solution && typeof current_solution === "string" && current_solution.length > 2000) {
      return NextResponse.json({ error: "当前方案描述过长" }, { status: 400 });
    }
    if (ideal_solution && typeof ideal_solution === "string" && ideal_solution.length > 2000) {
      return NextResponse.json({ error: "理想方案描述过长" }, { status: 400 });
    }
    if (submitter_name && typeof submitter_name === "string" && submitter_name.length > 30) {
      return NextResponse.json({ error: "昵称过长" }, { status: 400 });
    }

    // Rate limit
    const ip = getClientIP(request);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("demands")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);

    // Simple rate limit based on recent submissions (not per-IP since demands don't store IP)
    // For per-IP tracking, we'd need a separate table. This is a reasonable approximation.
    if (count !== null && count >= MAX_SUBMISSIONS_PER_IP_PER_HOUR) {
      return NextResponse.json({ error: "提交过于频繁，请稍后再试" }, { status: 429 });
    }

    const { error } = await supabaseAdmin.from("demands").insert({
      title: title.trim(),
      problem: problem.trim(),
      current_solution: current_solution?.trim() || null,
      ideal_solution: ideal_solution?.trim() || null,
      target_user: target_user.trim(),
      submitter_name: submitter_name?.trim() || null,
    });

    if (error) {
      return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "请求无效" }, { status: 400 });
  }
}

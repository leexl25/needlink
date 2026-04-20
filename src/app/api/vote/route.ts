import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_VOTES_PER_IP_PER_DAY = 20;

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const { demand_id, type } = await request.json();

    if (!demand_id || typeof demand_id !== "string") {
      return NextResponse.json({ error: "需求 ID 无效" }, { status: 400 });
    }
    if (type !== "like" && type !== "pay") {
      return NextResponse.json({ error: "投票类型无效" }, { status: 400 });
    }

    const ip = getClientIP(request);

    // Rate limit: max N votes per IP per day
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", since);

    if (count !== null && count >= MAX_VOTES_PER_IP_PER_DAY) {
      return NextResponse.json({ error: "今日投票次数已达上限" }, { status: 429 });
    }

    // Insert vote (UNIQUE constraint on demand_id + ip_address prevents duplicates)
    const { error } = await supabaseAdmin.from("votes").insert({
      demand_id,
      type,
      ip_address: ip,
      cookie_id: null,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "已投票", alreadyVoted: true }, { status: 200 });
      }
      return NextResponse.json({ error: "投票失败" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "请求无效" }, { status: 400 });
  }
}

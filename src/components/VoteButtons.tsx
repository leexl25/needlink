"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Coins } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Demand } from "@/types/demand";

interface VoteButtonsProps {
  demand: Demand;
  compact?: boolean;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export default function VoteButtons({ demand, compact = false }: VoteButtonsProps) {
  const [votes, setVotes] = useState(demand.votes);
  const [paidVotes, setPaidVotes] = useState(demand.paid_votes);
  const [voted, setVoted] = useState<"like" | "pay" | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShareHint, setShowShareHint] = useState(false);

  async function handleVote(type: "like" | "pay") {
    if (loading || voted) return;
    setLoading(true);

    try {
      let cookieId = getCookie("demandly_cookie_id");
      if (!cookieId) {
        cookieId = crypto.randomUUID();
        document.cookie = `demandly_cookie_id=${cookieId};path=/;max-age=${60 * 60 * 24 * 365}`;
      }

      const { error } = await supabase.from("votes").insert({
        demand_id: demand.id,
        type,
        ip_address: cookieId,
        cookie_id: cookieId,
      });

      if (error) {
        if (error.code === "23505") {
          setVoted(type);
        }
        return;
      }

      if (type === "like") {
        setVotes((v) => v + 1);
      } else {
        setPaidVotes((v) => v + 1);
      }
      setVoted(type);
      setShowShareHint(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={voted === "like" ? "default" : "secondary"}
        size={compact ? "sm" : "default"}
        onClick={() => handleVote("like")}
        disabled={loading || voted !== null}
      >
        <ThumbsUp className="size-4" />
        想要 {votes}
      </Button>
      <Button
        variant={voted === "pay" ? "default" : "secondary"}
        size={compact ? "sm" : "default"}
        onClick={() => handleVote("pay")}
        disabled={loading || voted !== null}
        className={voted === "pay" ? "bg-accent text-black hover:bg-accent-hover" : ""}
      >
        <Coins className="size-4" />
        愿付费 {paidVotes}
      </Button>
      {showShareHint && (
        <span className="text-xs text-primary animate-pulse">已投票！分享让更多人看到</span>
      )}
    </div>
  );
}

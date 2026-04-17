"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Coins } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Demand } from "@/types/demand";

interface VoteButtonsProps {
  demand: Demand;
  compact?: boolean;
  onVoted?: () => void;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export default function VoteButtons({ demand, compact = false, onVoted }: VoteButtonsProps) {
  const [votes, setVotes] = useState(demand.votes);
  const [paidVotes, setPaidVotes] = useState(demand.paid_votes);
  const [voted, setVoted] = useState<"like" | "pay" | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShareHint, setShowShareHint] = useState(false);

  async function handleVote(type: "like" | "pay") {
    if (loading || voted) return;

    // Rate limit: check cookie for recent vote count
    const cookieId = getCookie("demandly_cookie_id");
    if (cookieId) {
      const rateLimitKey = `demandly_vote_count_${cookieId}`;
      const lastReset = localStorage.getItem("demandly_vote_reset");
      const now = Date.now();
      // Reset counter every 10 minutes
      if (!lastReset || now - parseInt(lastReset) > 10 * 60 * 1000) {
        localStorage.setItem("demandly_vote_reset", now.toString());
        localStorage.setItem(rateLimitKey, "0");
      }
      const count = parseInt(localStorage.getItem(rateLimitKey) || "0");
      if (count >= 10) {
        return; // Silently block — max 10 votes per 10 min
      }
    }

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
      // Update rate limit counter
      if (cookieId) {
        const rateLimitKey = `demandly_vote_count_${cookieId}`;
        const count = parseInt(localStorage.getItem(rateLimitKey) || "0");
        localStorage.setItem(rateLimitKey, (count + 1).toString());
      }
      onVoted?.();
    } finally {
      setLoading(false);
    }
  }

  const btnSize = compact ? "sm" : "default";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size={btnSize}
        onClick={() => handleVote("like")}
        disabled={loading || voted !== null}
        className={`
          border-0 transition-all duration-200
          ${voted === "like"
            ? "glow-button-primary text-white vote-pulse"
            : "bg-white/[0.06] hover:bg-primary/15 hover:text-primary"
          }
        `}
      >
        <ThumbsUp className="size-4" />
        想要 {votes}
      </Button>
      <Button
        variant="secondary"
        size={btnSize}
        onClick={() => handleVote("pay")}
        disabled={loading || voted !== null}
        className={`
          border-0 transition-all duration-200
          ${voted === "pay"
            ? "glow-button-accent text-black vote-pulse"
            : "bg-white/[0.06] hover:bg-accent/15 hover:text-accent"
          }
        `}
      >
        <Coins className="size-4" />
        愿付费 {paidVotes}
      </Button>
      {showShareHint && (
        <span className="text-xs gradient-text font-medium animate-pulse">
          已投票！分享让更多人看到
        </span>
      )}
    </div>
  );
}

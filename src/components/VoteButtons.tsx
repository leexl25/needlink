"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Coins } from "lucide-react";
import type { Demand } from "@/types/demand";

interface VoteButtonsProps {
  demand: Demand;
  compact?: boolean;
  onVoted?: (type: "like" | "pay") => void;
}

export default function VoteButtons({ demand, compact = false, onVoted }: VoteButtonsProps) {
  const [votes, setVotes] = useState(demand.votes);
  const [paidVotes, setPaidVotes] = useState(demand.paid_votes);
  const [voted, setVoted] = useState<"like" | "pay" | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShareHint, setShowShareHint] = useState(false);

  // Check if already voted (persisted in localStorage)
  useEffect(() => {
    const key = `demandly_voted_${demand.id}`;
    const saved = localStorage.getItem(key);
    if (saved === "like" || saved === "pay") {
      setVoted(saved);
    }
  }, [demand.id]);

  async function handleVote(type: "like" | "pay") {
    if (loading || voted) return;
    setLoading(true);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demand_id: demand.id, type }),
      });

      const data = await res.json();

      if (data.alreadyVoted) {
        setVoted(type);
        localStorage.setItem(`demandly_voted_${demand.id}`, type);
        return;
      }

      if (!res.ok && !data.alreadyVoted) {
        return;
      }

      if (type === "like") {
        setVotes((v) => v + 1);
      } else {
        setPaidVotes((v) => v + 1);
      }
      setVoted(type);
      setShowShareHint(true);
      localStorage.setItem(`demandly_voted_${demand.id}`, type);
      onVoted?.(type);
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

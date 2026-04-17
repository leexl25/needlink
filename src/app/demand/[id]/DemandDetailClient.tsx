"use client";

import { useState } from "react";
import type { Demand } from "@/types/demand";
import VoteButtons from "@/components/VoteButtons";
import ShareModal from "@/components/ShareModal";
import { Share } from "lucide-react";

interface Props {
  demand: Demand;
  rank: number;
}

export default function DemandDetailClient({ demand, rank }: Props) {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card glow-border p-6">
        <h3 className="text-sm text-text-muted mb-4 uppercase tracking-wider font-medium">
          为这个需求投票
        </h3>
        <div className="flex items-center gap-3">
          <VoteButtons demand={demand} />
          <button
            onClick={() => setShowShare(true)}
            className="px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-sm hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-2 text-text-secondary hover:text-primary"
          >
            <Share className="size-4" />
            分享
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        demandTitle={demand.title}
        rank={rank}
        gapToNext={50}
        demandId={demand.id}
      />
    </div>
  );
}

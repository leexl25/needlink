"use client";

import { useState } from "react";
import type { Demand } from "@/types/demand";
import VoteButtons from "@/components/VoteButtons";
import ShareModal from "@/components/ShareModal";

interface Props {
  demand: Demand;
  rank: number;
}

export default function DemandDetailClient({ demand, rank }: Props) {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <VoteButtons demand={demand} />
        <button
          onClick={() => setShowShare(true)}
          className="px-4 py-2 bg-bg-hover border border-white/10 rounded-lg text-sm hover:border-primary/30 transition-colors"
        >
          分享
        </button>
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

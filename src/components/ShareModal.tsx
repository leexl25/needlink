"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  demandTitle: string;
  rank: number;
  gapToNext: number;
  demandId: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  demandTitle,
  rank,
  gapToNext,
  demandId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/demand/${demandId}`
      : "";
  const shareText = `我发起的需求正在冲榜！ ${demandTitle}，当前排名 #${rank}，帮我顶上去！`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareToTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-bg-card border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            投票成功！
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            「{demandTitle}」当前排名 <span className="gradient-text font-bold">#{rank}</span>
          </DialogDescription>
        </DialogHeader>

        {gapToNext > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-sm">
            <span className="text-primary font-medium">
              再获得 {gapToNext} 票就会被开发
            </span>
          </div>
        )}

        <p className="text-sm text-text-secondary">
          分享给朋友，让更多人投票！
        </p>

        <div className="flex gap-3">
          <Button onClick={copyLink} className="flex-1 glow-button-primary border-0">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "已复制！" : "复制链接"}
          </Button>
          <Button variant="outline" onClick={shareToTwitter} className="flex-1 border-white/10 hover:border-primary/40">
            <Share2 className="size-4" />
            分享到 Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

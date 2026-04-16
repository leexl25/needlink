"use client";

import { useState } from "react";

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

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/demand/${demandId}`
      : "";
  const shareText = `我发起的需求正在冲榜！🔥 ${demandTitle}，当前排名 #${rank}，帮我顶上去！`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-card rounded-xl border border-white/10 p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-2">🎉 投票成功！</h3>
        <p className="text-text-secondary text-sm mb-4">
          「{demandTitle}」当前排名 #{rank}
        </p>

        {gapToNext > 0 && (
          <div className="bg-primary/10 rounded-lg px-4 py-3 mb-4 text-sm">
            <span className="text-primary font-medium">
              再获得 {gapToNext} 票就会被开发
            </span>
          </div>
        )}

        <p className="text-sm text-text-secondary mb-4">
          分享给朋友，让更多人投票！
        </p>

        <div className="flex gap-3">
          <button
            onClick={copyLink}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? "已复制！" : "复制链接"}
          </button>
          <button
            onClick={shareToTwitter}
            className="flex-1 px-4 py-2 bg-bg-hover border border-white/10 rounded-lg text-sm font-medium hover:border-primary/30 transition-colors"
          >
            分享到 Twitter
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
}

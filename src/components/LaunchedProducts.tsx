import { Rocket, Users, ExternalLink } from "lucide-react";
import type { Product } from "@/types/demand";

interface LaunchedProductsProps {
  products: Product[];
}

export default function LaunchedProducts({ products }: LaunchedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="size-5 text-success" />
            <h2 className="text-xl md:text-2xl font-bold">已上线产品</h2>
          </div>
          <p className="text-sm text-text-muted">投票选出的需求，已经变成真正的产品</p>
        </div>
        <div className="text-xs text-text-muted">
          左右滑动查看更多 →
        </div>
      </div>

      {/* 横向滚动容器 */}
      <div className="relative">
        {/* 左侧渐变遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        {/* 右侧渐变遮罩 */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => {
            const daysSinceLaunch = Math.floor(
              (Date.now() - new Date(product.launched_at).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={product.id}
                className="glass-card glow-border p-5 shrink-0 w-72 snap-start"
              >
                <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Users className="size-3" />
                    上线 {daysSinceLaunch} 天 · {product.users_count} 人在用
                  </span>
                  <a
                    href={product.launch_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1 font-medium"
                  >
                    立即使用
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

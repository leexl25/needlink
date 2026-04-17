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
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <Rocket className="size-6 text-accent" />
          <h2 className="text-2xl md:text-3xl font-bold">已上线产品</h2>
        </div>
        <p className="text-text-secondary text-sm">这些是投票选出的需求，已经开发完成</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const daysSinceLaunch = Math.floor(
            (Date.now() - new Date(product.launched_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <div key={product.id} className="glass-card glow-border p-5 group">
              <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
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
    </section>
  );
}

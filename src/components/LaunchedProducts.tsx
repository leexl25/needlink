import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/demand";

export default async function LaunchedProducts() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("launched_at", { ascending: false })
    .limit(6);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
        🚀 已上线产品
      </h2>
      <p className="text-text-secondary text-center mb-8">
        这些都是投票选出的需求，已经开发完成
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(products as Product[]).map((product) => {
          const daysSinceLaunch = Math.floor(
            (Date.now() - new Date(product.launched_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={product.id}
              className="bg-bg-card rounded-xl border border-white/5 p-5 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  已上线 {daysSinceLaunch} 天 · {product.users_count} 人在用
                </span>
                <a
                  href={product.launch_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  立即使用 →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

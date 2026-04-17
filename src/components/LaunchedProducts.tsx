import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Users, ExternalLink } from "lucide-react";
import type { Product } from "@/types/demand";

export default async function LaunchedProducts() {
  let products: Product[] = [];

  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("launched_at", { ascending: false })
      .limit(6);
    products = (data as Product[]) || [];
  } catch {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
        <Rocket className="size-7 text-accent" />
        已上线产品
      </h2>
      <p className="text-text-secondary text-center mb-8">
        这些都是投票选出的需求，已经开发完成
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const daysSinceLaunch = Math.floor(
            (Date.now() - new Date(product.launched_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <Card key={product.id} className="bg-bg-card">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-text-secondary">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Users className="size-3" />
                    已上线 {daysSinceLaunch} 天 · {product.users_count} 人在用
                  </span>
                  <a
                    href={product.launch_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline flex items-center gap-1"
                  >
                    立即使用
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

import { Flame, Vote, Rocket } from "lucide-react";
import type { Demand, Product } from "@/types/demand";

interface StatsBarProps {
  demands: Demand[];
  products: Product[];
}

export default function StatsBar({ demands, products }: StatsBarProps) {
  const totalVotes = demands.reduce((sum, d) => sum + d.votes + d.paid_votes, 0);

  const stats = [
    { icon: <Flame className="size-5" />, value: demands.length, label: "个需求", color: "text-primary" },
    { icon: <Vote className="size-5" />, value: totalVotes, label: "次投票", color: "text-accent" },
    { icon: <Rocket className="size-5" />, value: products.length, label: "个已上线", color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card text-center py-4 px-3"
        >
          <div className={`${stat.color} flex justify-center mb-1`}>
            {stat.icon}
          </div>
          <div className="text-2xl md:text-3xl font-bold tabular-nums">{stat.value.toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

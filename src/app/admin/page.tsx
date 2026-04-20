import { supabaseAdmin } from "@/lib/supabase-admin";
import { Flame, FileText, Package, Clock, Vote } from "lucide-react";

export default async function AdminDashboard() {
  let totalDemands = 0;
  let openDemands = 0;
  let buildingDemands = 0;
  let launchedDemands = 0;
  let totalVotes = 0;
  let totalProducts = 0;

  try {
    const [demandsRes, productsRes, votesRes] = await Promise.all([
      supabaseAdmin.from("demands").select("status, votes, paid_votes"),
      supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("votes").select("id", { count: "exact", head: true }),
    ]);

    if (demandsRes.data) {
      totalDemands = demandsRes.data.length;
      openDemands = demandsRes.data.filter((d) => d.status === "open").length;
      buildingDemands = demandsRes.data.filter((d) => d.status === "building").length;
      launchedDemands = demandsRes.data.filter((d) => d.status === "launched").length;
      totalVotes = demandsRes.data.reduce((sum, d) => sum + (d.votes || 0) + (d.paid_votes || 0), 0);
    }
    totalProducts = productsRes.count || 0;
    totalVotes = votesRes.count || totalVotes;
  } catch {
    // fallback to 0
  }

  const stats = [
    { icon: <FileText className="size-5" />, label: "总需求", value: totalDemands, color: "text-primary" },
    { icon: <Flame className="size-5" />, label: "投票中", value: openDemands, color: "text-accent" },
    { icon: <Clock className="size-5" />, label: "开发中", value: buildingDemands, color: "text-primary" },
    { icon: <Vote className="size-5" />, label: "总投票", value: totalVotes, color: "text-success" },
    { icon: <Package className="size-5" />, label: "已上线产品", value: totalProducts, color: "text-accent" },
    { icon: <Package className="size-5" />, label: "已上线需求", value: launchedDemands, color: "text-success" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">仪表盘</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <div className="text-2xl font-bold tabular-nums">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-card p-6">
        <h2 className="text-sm font-medium text-text-muted mb-3">快速入口</h2>
        <div className="flex gap-4">
          <a href="/admin/demands" className="text-sm text-primary hover:underline">管理需求 →</a>
          <a href="/admin/products" className="text-sm text-accent hover:underline">管理产品 →</a>
        </div>
      </div>
    </div>
  );
}

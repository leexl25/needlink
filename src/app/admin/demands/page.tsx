"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { getDemandScore } from "@/types/demand";
import type { Demand } from "@/types/demand";
import { Search, RefreshCw } from "lucide-react";

const statusOptions: { value: Demand["status"]; label: string; variant: "default" | "secondary" | "destructive" | "outline" }[] = [
  { value: "open", label: "投票中", variant: "default" },
  { value: "building", label: "开发中", variant: "secondary" },
  { value: "launched", label: "已上线", variant: "outline" },
];

export default function AdminDemandsPage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchDemands = useCallback(async () => {
    const { data } = await supabase
      .from("demands")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDemands(data as Demand[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

  async function updateStatus(demandId: string, newStatus: Demand["status"]) {
    setUpdating(demandId);
    try {
      // Use the admin API to bypass RLS
      const res = await fetch("/api/admin/demands", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: demandId, status: newStatus }),
      });
      if (res.ok) {
        setDemands((prev) =>
          prev.map((d) => (d.id === demandId ? { ...d, status: newStatus } : d))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  const filtered = demands.filter((d) => {
    if (filter !== "all" && d.status !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">需求管理</h1>
        <Button variant="outline" size="sm" onClick={fetchDemands} className="border-white/10">
          <RefreshCw className="size-4" />
          刷新
        </Button>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索需求标题..."
            className="pl-9 bg-white/[0.04] border-white/[0.08]"
          />
        </div>
        <div className="flex gap-2">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
            全部 ({demands.length})
          </FilterBtn>
          <FilterBtn active={filter === "open"} onClick={() => setFilter("open")}>
            投票中
          </FilterBtn>
          <FilterBtn active={filter === "building"} onClick={() => setFilter("building")}>
            开发中
          </FilterBtn>
          <FilterBtn active={filter === "launched"} onClick={() => setFilter("launched")}>
            已上线
          </FilterBtn>
        </div>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">加载中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">无匹配需求</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((demand) => (
            <div
              key={demand.id}
              className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={statusOptions.find((s) => s.value === demand.status)?.variant || "default"}
                    className="text-[10px]"
                  >
                    {statusOptions.find((s) => s.value === demand.status)?.label}
                  </Badge>
                  <span className="text-xs text-text-muted tabular-nums">
                    分数 {getDemandScore(demand)}
                  </span>
                </div>
                <h3 className="font-medium text-sm truncate">{demand.title}</h3>
                <div className="text-xs text-text-muted mt-1 flex gap-3">
                  <span>想要 {demand.votes}</span>
                  <span>愿付费 {demand.paid_votes}</span>
                  <span>{new Date(demand.created_at).toLocaleDateString("zh-CN")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={demand.status}
                  onChange={(e) => updateStatus(demand.id, e.target.value as Demand["status"])}
                  disabled={updating === demand.id}
                  className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-primary/40"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-bg-card">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <a
                  href={`/demand/${demand.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  查看
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? "bg-primary/15 text-primary border border-primary/20"
          : "bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}

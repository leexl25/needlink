"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import type { Product, Demand } from "@/types/demand";
import { Plus, ExternalLink, RefreshCw } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    launch_url: "",
    demand_id: "",
    users_count: "0",
  });

  const fetchData = useCallback(async () => {
    const [productsRes, demandsRes] = await Promise.all([
      supabase.from("products").select("*").order("launched_at", { ascending: false }),
      supabase.from("demands").select("id, title, status").eq("status", "launched"),
    ]);
    if (productsRes.data) setProducts(productsRes.data as Product[]);
    if (demandsRes.data) setDemands(demandsRes.data as Demand[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          users_count: parseInt(form.users_count) || 0,
          demand_id: form.demand_id || null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ name: "", description: "", launch_url: "", demand_id: "", users_count: "0" });
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">产品管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} className="border-white/10">
            <RefreshCw className="size-4" />
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="glow-button-primary border-0">
            <Plus className="size-4" />
            添加产品
          </Button>
        </div>
      </div>

      {/* 添加产品表单 */}
      {showForm && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-sm font-medium mb-4">添加已上线产品</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary text-sm">产品名称 *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="产品名称"
                  className="bg-white/[0.04] border-white/[0.08]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary text-sm">产品链接 *</Label>
                <Input
                  required
                  value={form.launch_url}
                  onChange={(e) => setForm((f) => ({ ...f, launch_url: e.target.value }))}
                  placeholder="https://..."
                  className="bg-white/[0.04] border-white/[0.08]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-text-primary text-sm">产品描述 *</Label>
              <Textarea
                required
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="简短描述产品功能"
                className="bg-white/[0.04] border-white/[0.08] resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">关联需求（选填）</Label>
                <select
                  value={form.demand_id}
                  onChange={(e) => setForm((f) => ({ ...f, demand_id: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/40"
                >
                  <option value="" className="bg-bg-card">不关联</option>
                  {demands.map((d) => (
                    <option key={d.id} value={d.id} className="bg-bg-card">
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">初始用户数</Label>
                <Input
                  type="number"
                  value={form.users_count}
                  onChange={(e) => setForm((f) => ({ ...f, users_count: e.target.value }))}
                  className="bg-white/[0.04] border-white/[0.08]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting} className="glow-button-primary border-0">
                {submitting ? "添加中..." : "添加产品"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-white/10">
                取消
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 产品列表 */}
      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">加载中...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">
          还没有已上线产品，点击上方按钮添加
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="glass-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-xs text-text-muted mt-1 truncate">{product.description}</p>
                <div className="text-xs text-text-muted mt-1 flex gap-3">
                  <span>上线 {Math.floor((Date.now() - new Date(product.launched_at).getTime()) / 86400000)} 天</span>
                  <span>{product.users_count} 人在用</span>
                </div>
              </div>
              <a
                href={product.launch_url}
                target="_blank"
                className="text-xs text-accent hover:underline flex items-center gap-1 shrink-0"
              >
                访问
                <ExternalLink className="size-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

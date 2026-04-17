"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setError("密码错误");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="glass-card glow-border p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="size-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold">管理后台</h1>
          <p className="text-sm text-text-muted mt-1">请输入管理员密码</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 text-danger px-3 py-2 rounded-lg text-sm flex items-center gap-2 border border-danger/20">
              <AlertCircle className="size-4" />
              {error}
            </div>
          )}

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理员密码"
            className="bg-white/[0.04] border-white/[0.08]"
            autoFocus
          />

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full glow-button-primary border-0"
          >
            {loading ? "验证中..." : "登录"}
          </Button>
        </form>
      </div>
    </div>
  );
}

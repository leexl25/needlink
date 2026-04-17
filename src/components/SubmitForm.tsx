"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ROLES = ["上班族", "自媒体", "学生", "开发者", "电商卖家", "设计师", "其他"];

export default function SubmitForm() {
  const [form, setForm] = useState({
    title: "",
    problem: "",
    current_solution: "",
    ideal_solution: "",
    target_user: "",
    submitter_name: "",
    custom_role: "",
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleRoleSelect(role: string) {
    setSelectedRole(role);
    setForm((f) => ({ ...f, target_user: role === "其他" ? "" : role }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const targetUser =
      selectedRole === "其他" ? form.custom_role : form.target_user;

    if (!form.title || !form.problem || !targetUser) {
      setError("请填写必填项");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("demands").insert({
        title: form.title,
        problem: form.problem,
        current_solution: form.current_solution || null,
        ideal_solution: form.ideal_solution || null,
        target_user: targetUser,
        submitter_name: form.submitter_name || null,
      });

      if (insertError) {
        setError("提交失败，请稍后重试");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="size-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">需求已提交！</h2>
        <p className="text-text-secondary mb-8">
          审核通过后会在首页展示，请关注排行榜。
        </p>
        <Button render={<a href="/" />} size="lg" className="glow-button-primary border-0">
          返回首页
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-danger/10 text-danger px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-danger/20">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      {/* 你是谁 */}
      <div className="space-y-2">
        <Label className="text-text-primary text-sm">
          你是谁（角色）<span className="text-danger">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <Button
              key={role}
              type="button"
              size="sm"
              variant={selectedRole === role ? "default" : "secondary"}
              onClick={() => handleRoleSelect(role)}
              className={selectedRole === role ? "glow-button-primary border-0" : "bg-white/[0.06] border-0 hover:bg-primary/15 hover:text-primary"}
            >
              {role}
            </Button>
          ))}
        </div>
        {selectedRole === "其他" && (
          <Input
            value={form.custom_role}
            onChange={(e) =>
              setForm((f) => ({ ...f, custom_role: e.target.value, target_user: e.target.value }))
            }
            placeholder="请描述你的角色"
            className="bg-white/[0.04] border-white/[0.08]"
          />
        )}
      </div>

      {/* 需求标题 */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-text-primary text-sm">
          需求标题 <span className="text-danger">*</span>
        </Label>
        <Input
          id="title"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="一句话描述你想要的产品"
          className="bg-white/[0.04] border-white/[0.08] focus:border-primary/40"
        />
      </div>

      {/* 问题描述 */}
      <div className="space-y-2">
        <Label htmlFor="problem" className="text-text-primary text-sm">
          你遇到了什么问题 <span className="text-danger">*</span>
        </Label>
        <Textarea
          id="problem"
          required
          minLength={20}
          rows={3}
          value={form.problem}
          onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))}
          placeholder="具体描述你遇到的痛点场景（至少20字）"
          className="bg-white/[0.04] border-white/[0.08] focus:border-primary/40 resize-none"
        />
      </div>

      {/* 当前方案 */}
      <div className="space-y-2">
        <Label htmlFor="current_solution" className="text-text-secondary text-sm">
          你现在怎么解决的（选填）
        </Label>
        <Textarea
          id="current_solution"
          rows={2}
          value={form.current_solution}
          onChange={(e) =>
            setForm((f) => ({ ...f, current_solution: e.target.value }))
          }
          placeholder="你目前是怎么处理这个问题的"
          className="bg-white/[0.04] border-white/[0.08] focus:border-primary/40 resize-none"
        />
      </div>

      {/* 理想方案 */}
      <div className="space-y-2">
        <Label htmlFor="ideal_solution" className="text-text-secondary text-sm">
          你希望怎么解决（选填）
        </Label>
        <Textarea
          id="ideal_solution"
          rows={2}
          value={form.ideal_solution}
          onChange={(e) =>
            setForm((f) => ({ ...f, ideal_solution: e.target.value }))
          }
          placeholder="如果有工具能解决，你希望它是什么样的"
          className="bg-white/[0.04] border-white/[0.08] focus:border-primary/40 resize-none"
        />
      </div>

      {/* 昵称 */}
      <div className="space-y-2">
        <Label htmlFor="submitter_name" className="text-text-secondary text-sm">
          你的昵称（选填，会显示为发起人）
        </Label>
        <Input
          id="submitter_name"
          value={form.submitter_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, submitter_name: e.target.value }))
          }
          placeholder="不填则匿名"
          className="bg-white/[0.04] border-white/[0.08] focus:border-primary/40"
        />
      </div>

      {/* 提交按钮 */}
      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="w-full glow-button-primary border-0"
      >
        <Send className="size-4" />
        {submitting ? "提交中..." : "提交需求"}
      </Button>
    </form>
  );
}

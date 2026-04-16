"use client";

import { useState } from "react";
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
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">需求已提交！</h2>
        <p className="text-text-secondary mb-8">
          审核通过后会在首页展示，请关注排行榜。
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors inline-block"
        >
          返回首页
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-danger/10 text-danger px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 你是谁 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你是谁（角色）<span className="text-danger">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedRole === role
                  ? "bg-primary text-white"
                  : "bg-bg-card text-text-secondary hover:bg-bg-hover"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {selectedRole === "其他" && (
          <input
            type="text"
            value={form.custom_role}
            onChange={(e) =>
              setForm((f) => ({ ...f, custom_role: e.target.value, target_user: e.target.value }))
            }
            placeholder="请描述你的角色"
            className="mt-2 w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        )}
      </div>

      {/* 需求标题 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          需求标题 <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="一句话描述你想要的产品"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* 问题描述 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你遇到了什么问题 <span className="text-danger">*</span>
        </label>
        <textarea
          required
          minLength={20}
          rows={3}
          value={form.problem}
          onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))}
          placeholder="具体描述你遇到的痛点场景（至少20字）"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      {/* 当前方案 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你现在怎么解决的（选填）
        </label>
        <textarea
          rows={2}
          value={form.current_solution}
          onChange={(e) =>
            setForm((f) => ({ ...f, current_solution: e.target.value }))
          }
          placeholder="你目前是怎么处理这个问题的"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      {/* 理想方案 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你希望怎么解决（选填）
        </label>
        <textarea
          rows={2}
          value={form.ideal_solution}
          onChange={(e) =>
            setForm((f) => ({ ...f, ideal_solution: e.target.value }))
          }
          placeholder="如果有工具能解决，你希望它是什么样的"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      {/* 昵称 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你的昵称（选填，会显示为发起人）
        </label>
        <input
          type="text"
          value={form.submitter_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, submitter_name: e.target.value }))
          }
          placeholder="不填则匿名"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {submitting ? "提交中..." : "提交需求"}
      </button>
    </form>
  );
}

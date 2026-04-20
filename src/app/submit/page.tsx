import SubmitForm from "@/components/SubmitForm";

export const metadata = {
  title: "提交需求 - NeedLink",
};

export default function SubmitPage() {
  return (
    <main className="py-12">
      <a
        href="/"
        className="text-sm text-text-secondary hover:text-primary transition-colors mb-8 inline-flex items-center gap-1"
      >
        &larr; 返回首页
      </a>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          写下你的<span className="gradient-text">需求</span>
        </h1>
        <p className="text-text-secondary">
          也许下一个爆款产品就是它
        </p>
      </div>

      <div className="glass-card glow-border p-8 max-w-2xl mx-auto">
        <SubmitForm />
      </div>
    </main>
  );
}

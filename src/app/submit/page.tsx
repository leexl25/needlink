import SubmitForm from "@/components/SubmitForm";

export const metadata = {
  title: "提交需求 - Demandly",
};

export default function SubmitPage() {
  return (
    <main className="py-12">
      <a
        href="/"
        className="text-sm text-text-secondary hover:text-text-primary mb-6 inline-block"
      >
        ← 返回首页
      </a>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">写下你的需求</h1>
        <p className="text-text-secondary">
          也许下一个爆款产品就是它
        </p>
      </div>

      <SubmitForm />
    </main>
  );
}

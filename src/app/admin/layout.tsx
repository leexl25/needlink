import Link from "next/link";
import { LayoutDashboard, FileText, Package, LogOut, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "管理后台 - Demandly",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* 侧边栏 */}
      <aside className="w-56 shrink-0 border-r border-white/[0.06] bg-bg-surface p-4 hidden md:flex flex-col">
        <div className="mb-8">
          <h1 className="text-sm font-bold gradient-text">Demandly</h1>
          <p className="text-xs text-text-muted">管理后台</p>
        </div>

        <nav className="space-y-1 flex-1">
          <NavLink href="/admin" icon={<LayoutDashboard className="size-4" />}>
            仪表盘
          </NavLink>
          <NavLink href="/admin/demands" icon={<FileText className="size-4" />}>
            需求管理
          </NavLink>
          <NavLink href="/admin/products" icon={<Package className="size-4" />}>
            产品管理
          </NavLink>
        </nav>

        <div className="space-y-2 pt-4 border-t border-white/[0.06]">
          <NavLink href="/" icon={<ArrowLeft className="size-4" />}>
            返回前台
          </NavLink>
          <LogoutButton />
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 p-6 overflow-auto">
        {/* 移动端导航 */}
        <div className="md:hidden mb-6 flex items-center gap-3">
          <Link href="/admin" className="text-sm text-primary font-medium">仪表盘</Link>
          <Link href="/admin/demands" className="text-sm text-text-secondary">需求</Link>
          <Link href="/admin/products" className="text-sm text-text-secondary">产品</Link>
          <Link href="/" className="text-sm text-text-muted ml-auto">返回前台</Link>
        </div>
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/5 transition-colors"
      >
        <LogOut className="size-4" />
        退出登录
      </button>
    </form>
  );
}

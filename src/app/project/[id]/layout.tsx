"use client";

import { PropsWithChildren, use } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
interface PageProps extends PropsWithChildren {
  params: Promise<{ id: string }>;
}

export default function ProjectLayout({ children, params }: PageProps) {
  const { id } = use(params);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h2 className="text-xl font-bold">项目管理</h2>
        <nav className="space-y-2">
          {[
            { href: "home", label: "📌 项目设置" },
            { href: "knowledge", label: "📚 知识库" },
            { href: "inference", label: "💬 对话" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={`/project/${id}/${href}`}
              className={`block p-2 rounded ${
                pathname.endsWith(href) ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

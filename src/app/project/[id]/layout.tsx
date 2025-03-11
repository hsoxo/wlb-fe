"use client";

import { PropsWithChildren, use, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCreateChat, useGetAllChats } from "@/queries/chats";
import { PlusIcon } from "lucide-react";
interface PageProps extends PropsWithChildren {
  params: Promise<{ id: string }>;
}

export default function ProjectLayout({ children, params }: PageProps) {
  const { id } = use(params);
  const [showChats, setShowChats] = useState(false);
  const pathname = usePathname();
  const { data: chats } = useGetAllChats(id);
  const { mutate: createChat } = useCreateChat(id);

  const handleChangeChat = createChat;

  console.log(chats);
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h2 className="text-xl font-bold">项目管理</h2>
        <nav className="space-y-2">
          <Link
            href={`/project/${id}/home`}
            className={`block p-2 rounded ${
              pathname.endsWith("home") ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            📌 项目设置
          </Link>
          <Link
            href={`/project/${id}/knowledge`}
            className={`block p-2 rounded ${
              pathname.endsWith("knowledge")
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            📚 知识库
          </Link>
          <div
            className={`block p-2 rounded flex justify-between items-center cursor-pointer ${
              pathname.endsWith("inference")
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setShowChats(!showChats)}
          >
            <span className="flex items-center gap-2">
              <span>💬 对话</span>
            </span>
            <span
              className="text-xs text-gray-400 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleChangeChat();
              }}
            >
              <PlusIcon className="w-4 h-4" />
              <span>新建对话</span>
            </span>
          </div>

          <div className="flex flex-col gap-2 pl-4">
            {chats?.items.map((chat) => (
              <Link key={chat.id} href={`/project/${id}/inference/${chat.id}`}>
                {chat.name ?? "未命名对话"}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

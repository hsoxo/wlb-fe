"use client";

import { ChatMessage, useChat, useGetChat } from "@/queries/chats";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { MarkdownHooks } from "react-markdown";

interface PageProps {
  params: Promise<{ id: string; chatId: string }>;
}

function parseSchema(content: string) {
  const schema = {
    content: "",
    name: "",
    tool_call_id: "",
  };

  // Extract name
  const nameMatch = content.match(/name='(.*?)'/);
  if (nameMatch) {
    schema.name = nameMatch[1];
  }

  // Extract tool_call_id
  const toolCallMatch = content.match(/tool_call_id='(.*?)'/);
  if (toolCallMatch) {
    schema.tool_call_id = toolCallMatch[1];
  }

  // Extract content before 'name=' appears
  const contentMatch = content.match(/content='(.*?)'/);
  if (contentMatch) {
    schema.content = contentMatch[1];
  }

  return schema;
}

const Message = ({ message }: { message: ChatMessage }) => {
  const messageContent = JSON.parse(message.message).kwargs;
  const [isExpanded, setIsExpanded] = useState(message.role !== "tool");

  const roleColor = {
    human: "bg-gray-200",
    ai: "bg-green-200",
    tool: "bg-blue-200",
  };
  const align = {
    human: "self-end",
    ai: "self-start",
    tool: "self-start",
  };

  const actualMessage = useMemo(() => {
    if (message.role === "tool") {
      const schema = parseSchema(messageContent.content);
      return `工具调用: ${schema.name}，工具调用ID: ${
        schema.tool_call_id
      }\n${schema.content.replace(/\\n/g, "\n")}`;
    }
    return messageContent.content;
  }, [message.role, messageContent.content]);

  return (
    <div
      className={`${
        roleColor[message.role]
      } p-2 rounded-md shadow-md max-w-80% ${align[message.role]}`}
    >
      {isExpanded ? (
        <>
          <div className="prose prose-invert max-w-none">
            <MarkdownHooks
              components={{
                pre: ({ children }) => (
                  <pre className="overflow-auto p-2 my-2 rounded-lg bg-[rgba(1,1,1,0.1)]">
                    {children}
                  </pre>
                ),
                code: ({ children, className }) => (
                  <code className={`${className} text-sm`}>{children}</code>
                ),
              }}
            >
              {actualMessage}
            </MarkdownHooks>
          </div>
          {message.role === "tool" && (
            <button
              className="text-sm text-gray-500 cursor-pointer"
              onClick={() => setIsExpanded(false)}
            >
              Toolcall Response 收起
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <button
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            Toolcall Response 展开
          </button>
        </div>
      )}
    </div>
  );
};

export default function InferencePage({ params }: PageProps) {
  const { id: projectId, chatId } = use(params);
  const { data: chat, isLoading, error } = useGetChat(projectId, chatId);
  const [input, setInput] = useState("");
  const { mutate: chatMutation, isPending } = useChat(projectId, chatId);
  const ref = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    chatMutation(input);
    setInput("");
  };

  useEffect(() => {
    if (!isLoading && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-50px)]">
      <h1 className="text-2xl font-bold pb-4">{chat?.name ?? "未命名对话"}</h1>
      <div className="flex-1 overflow-y-auto" ref={ref}>
        <div className="flex flex-col gap-4">
          {chat?.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 py-4 w-full">
        <div className="flex gap-2 border rounded-md w-full">
          <textarea
            className="w-full p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            rows={4}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={handleSend}
            disabled={isPending}
          >
            {isPending ? "发送中..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}

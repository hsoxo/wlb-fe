"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetKnowledgeBase,
  useSyncKnowledgeBase,
  useTrainKnowledgeBase,
} from "@/queries/knowledge-bases";
import { use } from "react";
import KnowledgeTable from "./components/KnowledgeTable";

interface PageProps {
  params: Promise<{ id: string; kbId: string }>;
}

export default function KnowledgeBaseDetail({ params }: PageProps) {
  const { kbId } = use(params);

  const { data: knowledgeBase, isLoading, error } = useGetKnowledgeBase(kbId);
  const { mutate: syncKnowledgeBase } = useSyncKnowledgeBase(kbId);
  const { mutate: trainKnowledgeBase } = useTrainKnowledgeBase(kbId);

  if (isLoading) return <p className="text-gray-500">加载中...</p>;
  if (error) return <p className="text-red-500">加载失败</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">知识库详情</h1>
        <div>
          {knowledgeBase?.createdAt && (
            <p className="text-sm text-gray-500">
              创建时间: {new Date(knowledgeBase.createdAt).toLocaleString()}
            </p>
          )}
          {knowledgeBase?.updatedAt && (
            <p className="text-sm text-gray-500">
              修改时间: {new Date(knowledgeBase.updatedAt).toLocaleString()}
            </p>
          )}
          {knowledgeBase?.statusName && (
            <p className="text-sm text-gray-500">
              状态: {knowledgeBase.statusName}
            </p>
          )}
        </div>
      </div>

      {/* Action Area */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => syncKnowledgeBase()}>
          同步
        </Button>
        <Button variant="outline" onClick={() => trainKnowledgeBase()}>
          训练
        </Button>
        <Button>保存</Button>
        <Button variant="destructive">删除</Button>
      </div>

      {/* 可编辑信息 */}
      <div>
        <label className="text-sm font-medium">知识库名称</label>
        <Input name="name" value={knowledgeBase?.name} />
      </div>

      <div>
        <label className="text-sm font-medium">知识库描述</label>
        <textarea
          name="description"
          className="border w-full p-2 rounded"
          value={knowledgeBase?.description}
        />
      </div>

      <KnowledgeTable kbId={kbId} />
    </div>
  );
}

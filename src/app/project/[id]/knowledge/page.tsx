"use client";

import { useState, use } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, Plus, Edit } from "lucide-react";
import { useKnowledgeBases } from "@/queries/knowledge-bases";
import Link from "next/link";
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KnowledgeBase({ params }: PageProps) {
  const { id: projectId } = use(params);
  const {
    knowledgeBases,
    isLoading,
    error,
    knowledgeBaseTypes,
    createKnowledgeBase,
  } = useKnowledgeBases(projectId);

  const [name, setName] = useState("");
  const [type, setType] = useState("document"); // 默认类型
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    createKnowledgeBase({ name, type: parseInt(type), projectId });
    setName("");
    setOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">知识库</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2" size={18} />
              添加知识库
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建知识库</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  {knowledgeBaseTypes?.items.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="知识库名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button onClick={handleCreate}>创建</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 表格 */}
      {isLoading ? (
        <p className="text-gray-500 flex items-center">
          <Loader2 className="animate-spin mr-2" size={18} />
          加载中...
        </p>
      ) : error ? (
        <p className="text-red-500">加载失败</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {knowledgeBases?.items.map((kb) => (
              <TableRow key={kb.id}>
                <TableCell>{kb.name}</TableCell>
                <TableCell>{kb.typeName}</TableCell>
                <TableCell>{kb.description || "无描述"}</TableCell>
                <TableCell>{kb.statusName}</TableCell>
                <TableCell>{new Date(kb.updatedAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon">
                    <Link href={`/project/${projectId}/knowledge/${kb.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

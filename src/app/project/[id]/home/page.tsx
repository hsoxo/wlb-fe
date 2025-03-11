"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetProject, useUpdateProject } from "@/queries/project";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectSettings({ params }: PageProps) {
  const { id } = use(params);
  const { data: project, isLoading, error } = useGetProject(id);
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        systemPrompt: project.systemPrompt,
      });
    }
  }, [project]);

  // 处理表单更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 提交更新
  const handleSubmit = async () => {
    if (!project) return;
    await updateProject({
      id: project.id,
      name: formData.name,
      description: formData.description,
      systemPrompt: formData.systemPrompt,
    });
  };

  if (isLoading) return <p className="text-gray-500">加载中...</p>;
  if (error) return <p className="text-red-500">加载失败</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">项目设置</h1>

        <div>
          {project?.createdAt && (
            <p className="text-sm text-gray-500">
              创建时间: {new Date(project.createdAt).toLocaleString()}
            </p>
          )}
          {project?.updatedAt && (
            <p className="text-sm text-gray-500">
              修改时间: {new Date(project.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* 可编辑信息 */}
      <div>
        <label className="text-sm font-medium">项目名称</label>
        <Input name="name" value={formData.name} onChange={handleChange} />
      </div>

      <div>
        <label className="text-sm font-medium">项目描述</label>
        <textarea
          name="description"
          className="border w-full p-2 rounded"
          value={formData.description}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <div>
        <label className="text-sm font-medium">System Prompt</label>
        <textarea
          name="systemPrompt"
          className="border w-full p-2 rounded"
          value={formData.systemPrompt}
          onChange={handleChange}
          rows={24}
        />
      </div>

      <Button onClick={handleSubmit} disabled={isUpdating}>
        {isUpdating ? (
          <Loader2 className="animate-spin mr-2" size={18} />
        ) : (
          "保存"
        )}
      </Button>
    </div>
  );
}

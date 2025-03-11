"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useProjects, useCreateProject } from "@/queries/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projects, isLoading, error } = useProjects();
  const { mutate: createProject, isPending: isCreateProjectLoading } =
    useCreateProject();

  const [newProjectName, setNewProjectName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    await createProject({ name: newProjectName });
    setNewProjectName("");
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {/* 头部 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          我的项目
        </h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2" size={18} />
              新建项目
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建项目</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="请输入项目名称"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateProject}
                className="w-full"
                disabled={!newProjectName.trim() || isCreateProjectLoading}
              >
                {isCreateProjectLoading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Plus className="mr-2" size={18} />
                )}
                创建
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 加载 & 错误状态 */}
      {isLoading && <p className="text-gray-500">加载中...</p>}
      {error && <p className="text-red-500">加载失败: {error.message}</p>}

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card
            key={project.id}
            className="p-4 shadow-lg hover:shadow-xl transition hover:cursor-pointer"
            onClick={() => router.push(`/project/${project.id}`)}
          >
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                创建时间: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

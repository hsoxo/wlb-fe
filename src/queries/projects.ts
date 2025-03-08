import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "./base";
import { Project } from "@/types/project";

interface CreateProject {
  name: string;
}

// 项目 Hook
export function useProjects() {
  const queryClient = useQueryClient();

  // 获取所有项目
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: (): Promise<Project[]> => get("/api/projects"),
  });

  // 创建项目
  const createMutation = useMutation({
    mutationFn: (project: CreateProject) => post("/api/projects", project),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }), // 刷新数据
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createMutation.mutateAsync,
    isCreateProjectLoading: createMutation.isPending,
  };
}

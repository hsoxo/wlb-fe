import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, put, del } from "./base";
import { Project } from "@/types/project";

export function useProject(id: string) {
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: (): Promise<Project> => get(`/api/projects/${id}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => del(`/api/projects/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects", id] }), // 重新获取
  });

  // 更新项目
  const updateMutation = useMutation({
    mutationFn: (project: Partial<Project>) =>
      put(`/api/projects/${id}`, project),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects", id] }),
  });

  return {
    project,
    isLoading,
    error,
    deleteProject: deleteMutation.mutateAsync,
    isDeleteProjectLoading: deleteMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdateProjectLoading: updateMutation.isPending,
  };
}

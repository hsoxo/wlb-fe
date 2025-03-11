import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, put, del, post } from "./base";
import { Project } from "@/types/project";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: (): Promise<Project[]> => get("/api/projects"),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: { name: string }) => post("/api/projects", project),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useGetProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: (): Promise<Project> => get(`/api/projects/${id}`),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Omit<Project, "createdAt" | "updatedAt">) =>
      put(`/api/projects/${project.id}`, project),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => del(`/api/projects/${id}`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
  });
};

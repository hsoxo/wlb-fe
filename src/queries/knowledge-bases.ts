import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KnowledgeBase, KnowledgeBaseType } from "@/types/project";
import { del, get, post, put } from "./base";

export const useKnowledgeBaseTypes = () => {
  return useQuery({
    queryKey: ["knowledgeBaseTypes"],
    queryFn: (): Promise<{ items: KnowledgeBaseType[] }> =>
      get("/api/knowledge-bases/types"),
  });
};

export const useGetAllKnowledgeBases = (projectId: string) => {
  return useQuery({
    queryKey: ["knowledgeBases", projectId],
    queryFn: (): Promise<{ items: KnowledgeBase[] }> =>
      get(`/api/knowledge-bases?project_id=${projectId}`),
  });
};

export const useCreateKnowledgeBase = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (knowledgeBase: {
      name: string;
      type: number;
      projectId: string;
    }) => post("/api/knowledge-bases", knowledgeBase),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBases", projectId],
      });
    },
  });
};

export const useGetKnowledgeBase = (kbId: string) => {
  return useQuery({
    queryKey: ["knowledgeBase", kbId],
    queryFn: (): Promise<KnowledgeBase> => get(`/api/knowledge-bases/${kbId}`),
  });
};

export const useUpdateKnowledgeBase = (kbId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (knowledgeBase: KnowledgeBase) =>
      put(`/api/knowledge-bases/${kbId}`, knowledgeBase),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBases", kbId],
      });
    },
  });
};

export const useDeleteKnowledgeBase = (kbId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => del(`/api/knowledge-bases/${kbId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBases", kbId],
      });
    },
  });
};

export const useSyncKnowledgeBase = (kbId: string) => {
  return useMutation({
    mutationFn: () => post(`/api/knowledge-bases/${kbId}/sync`),
  });
};

export const useTrainKnowledgeBase = (kbId: string) => {
  return useMutation({
    mutationFn: () => post(`/api/knowledge-bases/${kbId}/train`),
  });
};

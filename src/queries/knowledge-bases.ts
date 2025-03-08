import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KnowledgeBase, KnowledgeBaseType } from "@/types/project";
import { get, post, put } from "./base";

export const useKnowledgeBases = (projectId: string) => {
  const queryClient = useQueryClient();

  const {
    data: knowledgeBases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["knowledgeBases", projectId],
    queryFn: (): Promise<{ items: KnowledgeBase[] }> =>
      get(`/api/knowledge-bases?project_id=${projectId}`),
  });

  const {
    data: knowledgeBaseTypes,
    isLoading: isKnowledgeBaseTypesLoading,
    error: knowledgeBaseTypesError,
  } = useQuery({
    queryKey: ["knowledgeBaseTypes"],
    queryFn: (): Promise<{ items: KnowledgeBaseType[] }> =>
      get("/api/knowledge-bases/types"),
  });

  const createKnowledgeBase = useMutation({
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

  return {
    knowledgeBases,
    isLoading,
    error,
    knowledgeBaseTypes,
    isKnowledgeBaseTypesLoading,
    knowledgeBaseTypesError,
    createKnowledgeBase: createKnowledgeBase.mutate,
  };
};

// 知识库 Hook
export function useKnowledgeBase(kbId: string) {
  const queryClient = useQueryClient();

  const {
    data: knowledgeBase,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["knowledgeBase", kbId],
    queryFn: (): Promise<KnowledgeBase> => get(`/api/knowledge-bases/${kbId}`),
  });

  const updateKnowledgeBase = useMutation({
    mutationFn: (knowledgeBase: KnowledgeBase) =>
      put(`/api/knowledge-bases/${kbId}`, knowledgeBase),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", kbId],
      });
    },
  });

  const syncKnowledgeBase = useMutation({
    mutationFn: (kbId: string) => post(`/api/knowledge-bases/${kbId}/sync`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", kbId],
      });
    },
  });

  return {
    knowledgeBase,
    isLoading,
    error,
    updateKnowledgeBase: updateKnowledgeBase.mutate,
    syncKnowledgeBase: syncKnowledgeBase.mutate,
  };
}

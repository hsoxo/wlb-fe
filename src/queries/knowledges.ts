import { useQuery } from "@tanstack/react-query";
import { get } from "./base";

interface Knowledge {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const useGetAllKnowledges = (kbId: string) => {
  return useQuery({
    queryKey: ["knowledges", kbId],
    queryFn: (): Promise<{
      items: Knowledge[];
      total: number;
      page: number;
      pageSize: number;
    }> => get(`/api/knowledge/${kbId}/list`),
  });
};

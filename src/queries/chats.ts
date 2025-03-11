import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post } from "./base";
import { useRouter } from "next/navigation";

interface Chat {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  role: "human" | "ai" | "tool";
  createdAt: string;
  updatedAt: string;
}

interface ChatResponse {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export const useGetAllChats = (projectId: string) => {
  return useQuery({
    queryKey: ["chats", projectId],
    queryFn: () => get<{ items: Chat[] }>(`/api/project/${projectId}/chats`),
  });
};

export const useGetChat = (projectId: string, chatId: string) => {
  return useQuery({
    queryKey: ["chat", projectId, chatId],
    queryFn: () =>
      get<ChatResponse>(`/api/project/${projectId}/chat/${chatId}`),
  });
};

export const useCreateChat = (projectId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (): Promise<{ id: string }> =>
      post<void, { id: string }>(`/api/project/${projectId}/chats`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["chats", projectId],
      });
      router.push(`/project/${projectId}/inference/${data.id}`);
    },
  });
};

export const useChat = (projectId: string, chatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) =>
      post(`/api/project/${projectId}/chat/${chatId}/inference`, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat", projectId, chatId],
      });
    },
  });
};

import apiClient from "@/lib/axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      toCamelCase(value),
    ])
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/([A-Z])/g, "_$1").toLowerCase(),
      toSnakeCase(value),
    ])
  );
};

export const get = async <T>(url: string): Promise<T> => {
  const res = await apiClient.get<T>(url);
  return toCamelCase(res.data) as T;
};

export const post = async <Input, Output>(
  url: string,
  data?: Input,
): Promise<Output> => {
  const res = await apiClient.post<Output>(url, toSnakeCase(data));
  return toCamelCase(res.data) as Output;
};

export const put = async <Input, Output>(
  url: string,
  data: Input,
): Promise<Output> => {
  const res = await apiClient.put<Output>(url, toSnakeCase(data));
  return toCamelCase(res.data) as Output;
};

export const del = async <Output>(
  url: string,
): Promise<Output> => {
  const res = await apiClient.delete<Output>(url);
  return toCamelCase(res.data) as Output;
};
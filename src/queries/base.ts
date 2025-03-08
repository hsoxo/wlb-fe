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

export const get = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("请求失败");
  const data = await res.json();
  return toCamelCase(data) as T;
};

export const post = async <Input, Output>(
  url: string,
  data?: Input,
  options?: RequestInit
): Promise<Output> => {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(toSnakeCase(data)),
  });
  if (!res.ok) throw new Error("请求失败");
  return toCamelCase(await res.json()) as Output;
};

export const put = async <Input, Output>(
  url: string,
  data: Input,
  options?: RequestInit
): Promise<Output> => {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(toSnakeCase(data)),
  });
  if (!res.ok) throw new Error("请求失败");
  return toCamelCase(await res.json()) as Output;
};

export const del = async <Output>(
  url: string,
  options?: RequestInit
): Promise<Output> => {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });
  if (!res.ok) throw new Error("请求失败");
  return toCamelCase(await res.json()) as Output;
};

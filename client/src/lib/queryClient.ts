import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    const error = new Error(`${res.status}: ${text}`);
    (error as any).status = res.status;
    throw error;
  }
}

// Function overloads
export async function apiRequest(url: string): Promise<any>;
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response>;

export async function apiRequest(
  methodOrUrl: string,
  url?: string,
  data?: unknown | undefined,
): Promise<any> {
  // If second parameter is undefined, first parameter is URL (GET request)
  if (url === undefined) {
    const res = await fetch(methodOrUrl, {
      method: 'GET',
      credentials: "include",
    });
    await throwIfResNotOk(res);
    return await res.json();
  }
  
  // Otherwise, first parameter is method
  const res = await fetch(url, {
    method: methodOrUrl,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

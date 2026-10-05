import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    // Anonymous visitors are a normal state, not a failed query. Treating 401
    // as an error lets each remounted auth consumer restart the loading cycle.
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnMount: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

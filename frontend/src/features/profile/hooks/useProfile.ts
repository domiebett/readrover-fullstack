import { useQuery } from "@tanstack/react-query";
import { getProfile, profileKeys } from "../api";
import { HttpError } from "@/lib/api";

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: getProfile,
    retry: (failureCount, error) => {
      if (error instanceof HttpError && error.status === 401) {
        return false; // Don't retry 401s, they're handled globally
      }
      return failureCount < 3;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

import { redirect } from "react-router-dom";
import { getMe } from "@/features/auth/api";
import { queryClient } from "@/app/queryClient";
import { HttpError } from "@/lib/api";

const meKey = ["me"];

export async function meLoader() {
  // Use fetchQuery instead of ensureQueryData to better control caching
  const result = await queryClient.fetchQuery({
    queryKey: meKey,
    queryFn: getMe,
    staleTime: Infinity,
    gcTime: Infinity, // Keep the data in cache indefinitely
    retry: (failureCount, error) => {
      // Don't retry on 401 unauthorized errors, but retry other errors up to 2 times
      if (error instanceof HttpError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    }
  });
  return result;
}

export async function requireAuthLoader() {
  try {
    // First check if we have the data in cache
    const cached = queryClient.getQueryData(meKey);
    if (cached) return cached;

    // If not in cache, fetch it
    const me = await meLoader();
    if (!me) throw redirect("/login");
    return me;
  } catch {
    throw redirect("/login");
  }
}

export async function requireGuestLoader() {
  try {
    // First check if we have the data in cache
    const cached = queryClient.getQueryData(meKey);
    if (cached) throw redirect("/");

    // For guest routes, we don't need to fetch if there's no cached data
    // If there's no cache, we assume the user is not logged in
    return null;
  } catch (error) {
    if (error instanceof Response && error.status === 303) throw error;
    return null;
  }
}

import { apiFetch } from "@/lib/api";

export type Profile = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

export async function getProfile(): Promise<Profile> {
  return apiFetch("/api/me");
}

// Keys for React Query
export const profileKeys = {
  all: ["profile"] as const,
  profile: () => [...profileKeys.all] as const,
} as const;

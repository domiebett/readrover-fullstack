import { apiFetch } from "@/lib/api";

export type Me = { 
  id: string; 
  email: string;
  username: string;
  created_at: string;
};

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export const getMe = () => apiFetch<Me>("/api/me");

export const login = (b: LoginPayload) =>
  apiFetch<{ ok: true }>("/api/login", {
    method: "POST",
    body: JSON.stringify(b),
  });

export const register = (b: RegisterPayload) =>
  apiFetch<{ ok: true }>("/api/register", {
    method: "POST",
    body: JSON.stringify(b),
  });

export const logout = () =>
  apiFetch<{ ok: true }>("/api/logout", {
    method: "POST",
  });



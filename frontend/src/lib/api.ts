import { API_URL } from "@/lib/env";
import { authEvents } from "@/app/authEvents";

export class HttpError extends Error {
  status: number;
  constructor(s: number, m: string) {
    super(m);
    this.status = s;
  }
}

let refreshing: Promise<boolean> | null = null;
async function tryRefresh(): Promise<boolean> {
  return false;
} // wire later

async function requestOnce<T>(path: string, opts: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    // Emit unauthorized event for 401s
    if (res.status === 401) {
      authEvents.emitUnauthorized();
    }
    throw new HttpError(res.status, data?.detail || res.statusText);
  }
  return data as T;
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  try {
    return await requestOnce<T>(path, opts);
  } catch (e: unknown) {
    if (e instanceof HttpError && e.status === 401) {
      if (!refreshing)
        refreshing = tryRefresh().finally(() => {
          refreshing = null;
        });
      const ok = await refreshing;
      if (ok) return await requestOnce<T>(path, opts);
      authEvents.emitUnauthorized();
    }
    throw e;
  }
}

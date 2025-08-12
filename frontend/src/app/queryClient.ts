import { QueryClient } from "@tanstack/react-query";
import { HttpError } from "@/lib/api";
import { authEvents } from "@/app/authEvents";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: (count, err: Error) =>
        err instanceof HttpError && err.status === 401 ? false : count < 2,
    },
    mutations: {
      retry: (count, err: Error) =>
        err instanceof HttpError && err.status === 401 ? false : count < 1,
    },
  },
});

queryClient.getQueryCache().subscribe((ev) => {
  if (ev?.type === "updated" && ev.query?.state.status === "error") {
    const err = ev.query.state.error as Error;
    if (err instanceof HttpError && err.status === 401)
      authEvents.emitUnauthorized();
  }
});

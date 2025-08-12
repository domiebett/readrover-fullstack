import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { queryClient } from "./queryClient";
import { authEvents } from "./authEvents";

export function AuthEventsHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authEvents.onUnauthorized(async () => {
      await queryClient.clear();
      const loc = window.location.pathname + window.location.search;
      const to = `/login?from=${encodeURIComponent(loc)}`;
      if (window.location.pathname !== "/login") {
        navigate(to, { replace: true });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return null;
}

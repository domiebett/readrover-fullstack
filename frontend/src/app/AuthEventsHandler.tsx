import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { queryClient } from "./queryClient";
import { authEvents } from "./authEvents";
import { getPublicRoutePaths } from "./routesConfig";

function isCurrentRoutePublic() {
  const publicPaths = getPublicRoutePaths();
  return publicPaths.includes(window.location.pathname);
}

export function AuthEventsHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authEvents.onUnauthorized(async () => {
      try {
        // Call logout endpoint to clear cookies
        await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.error('Failed to logout:', error);
      } finally {
        // Clear all queries from cache
        await queryClient.clear();
        // Only redirect to login if not on a public route
        if (!isCurrentRoutePublic()) {
          const loc = window.location.pathname + window.location.search;
          const to = `/login?from=${encodeURIComponent(loc)}`;
          if (window.location.pathname !== "/login") {
            navigate(to, { replace: true });
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return null;
}

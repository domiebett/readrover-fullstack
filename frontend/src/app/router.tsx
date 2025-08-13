import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthEventsHandler } from "./AuthEventsHandler";
import { MainLayout } from "../layouts/MainLayout";
import { publicRoutesConfig, mainLayoutRoutesConfig } from "./routesConfig";

function Root() {
  return (
    <div>
      <AuthEventsHandler />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      ...publicRoutesConfig,
      {
        element: <MainLayout />,
        children: [...mainLayoutRoutesConfig],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

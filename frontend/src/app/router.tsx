import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { requireAuthLoader, requireGuestLoader } from "./auth";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProfilePage from "@/features/profile/ProfilePage";
import { AuthEventsHandler } from "./AuthEventsHandler";
import { MainLayout } from "@/layouts/MainLayout";

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
      // Guest routes
      { path: "login", loader: requireGuestLoader, element: <LoginPage /> },
      { path: "register", loader: requireGuestLoader, element: <RegisterPage /> },
      // Protected routes with MainLayout
      {
        element: <MainLayout />,
        children: [
          { index: true, loader: requireAuthLoader, element: <HomePage /> },
          { path: "profile", loader: requireAuthLoader, element: <ProfilePage /> },
        ],
      },
    ],
  },
]);


export function AppRouter() {
  return <RouterProvider router={router} />;
}

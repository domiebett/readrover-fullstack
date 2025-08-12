import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { requireAuthLoader, requireGuestLoader } from "./auth";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import { AuthEventsHandler } from "./AuthEventsHandler";

function Root() {
  return (
    <div>
      <AuthEventsHandler />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Root/>, children: [
    { index: true, loader: requireAuthLoader, element: <HomePage/> },
    { path: "login", loader: requireGuestLoader, element: <LoginPage/> },
    { path: "register", loader: requireGuestLoader, element: <RegisterPage/> },
  ]}
]);


export function AppRouter() {
  return <RouterProvider router={router} />;
}

import { LandingPage } from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../features/profile/ProfilePage";
import { requireAuthLoader, requireGuestLoader } from "./auth";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Public routes
export const publicRoutesConfig = [
  { path: "/", element: <LandingPage /> },
  { path: "login", loader: requireGuestLoader, element: <LoginPage /> },
  { path: "register", loader: requireGuestLoader, element: <RegisterPage /> },
];

// Main layout (protected) routes
export const mainLayoutRoutesConfig = [
  { path: "home", loader: requireAuthLoader, element: <HomePage /> },
  { path: "profile", loader: requireAuthLoader, element: <ProfilePage /> },
];

// Utility: get all public route paths
export const getPublicRoutePaths = () =>
  publicRoutesConfig.map(route => route.path === "/" ? "/" : `/${route.path}`);

import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "@/features/auth/api";
import { getMe } from "@/features/auth/api";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { queryClient } from "@/app/queryClient";

const meKey = ["me"];

interface HeaderProps {
  mode?: "landing" | "app";
}

export function Header({ mode = "app" }: HeaderProps) {
  const navigate = useNavigate();
  const { data: me } = useQuery({
    queryKey: meKey,
    queryFn: getMe,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Failed to logout:", error);
    },
  });

  return (
    <header className={mode === "landing" ? "px-4 py-6 md:px-8" : "border-b flex justify-center"}>
      <div className={mode === "landing" ? "max-w-6xl mx-auto" : "container py-4"}>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <Link 
              to={me && mode === "app" ? "/home" : "/"} 
              className="font-serif text-2xl md:text-3xl font-bold text-yellow-800"
            >
              BookNook
            </Link>
          </div>

          {mode === "app" && me && (
            <NavigationMenu className="flex-1 flex justify-center">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/books" className="px-4 py-2 hover:text-primary">
                    Books
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/shelves" className="px-4 py-2 hover:text-primary">
                    Shelves
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center gap-3">
            {me ? (
              mode === "landing" ? (
                <Link to="/home">
                  <Button className="bg-yellow-700 hover:bg-yellow-800 text-white shadow-lg">
                    Go to Library
                  </Button>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="gap-2 text-yellow-800 hover:text-yellow-900"
                      aria-label="User menu"
                    >
                      <UserCircle className="h-5 w-5" />
                      {me.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm border-yellow-200 shadow-lg">
                    <DropdownMenuItem role="menuitem" onClick={() => navigate('/profile')} className="hover:bg-yellow-50">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-yellow-100" />
                    <DropdownMenuItem
                      role="menuitem"
                      className="text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={() => logoutMutation.mutate()}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 bg-white/80">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-yellow-700 hover:bg-yellow-800 text-white shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

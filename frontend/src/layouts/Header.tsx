import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/auth/api";
import type { Me } from "@/features/auth/api";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button/button";
import { UserCircle } from "lucide-react";
import { queryClient } from "@/app/queryClient";

const meKey = ["me"];

export function Header() {
  const navigate = useNavigate();
  const me = queryClient.getQueryData<Me>(meKey);

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
    <header className="border-b">
      <div className="container py-4">
        <div className="flex justify-between items-center gap-4">
          <Link to="/" className="text-lg font-semibold shrink-0">
            ReadRover
          </Link>
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
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="gap-2"
                  aria-label="User menu"
                >
                  <UserCircle className="h-5 w-5" />
                  {me?.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem role="menuitem" onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  role="menuitem"
                  className="cursor-pointer text-red-600"
                  onClick={() => logoutMutation.mutate()}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

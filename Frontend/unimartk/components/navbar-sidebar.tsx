import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageSquare, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { UserProfile } from "@/modules/auth/types/auth";
import { useTheme } from "next-themes";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, onOpenChange, open }: Props) => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    // Check authentication status on the client side
    setUserProfile(user);
  }, []);

  const handleProfile = () => router.push("/profile");
  const handleAdminDashboard = () => router.push("/admin");
  const handleLogout = () => {
    logout();
    setUserProfile(null);
    router.push("/");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2 ">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium text-base"
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
        </ScrollArea>
        {isAuthenticated ? (
          <div className="border-t flex flex-row gap-4 p-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="rounded-full size-14 " asChild>
              <Link href={"/messages"}>
                <MessageSquare className="size-8" strokeWidth={1} />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full size-14 ">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src="https://i.pravatar.cc/150?img=3"
                      alt="User Avatar"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>
                  {userProfile?.name || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  Profile
                </DropdownMenuItem>
                {userProfile?.role?.name === "admin" && (
                  <DropdownMenuItem onClick={handleAdminDashboard}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="border-t">
            <Link
              href={"/sign-in"}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium text-base"
            >
              Log in
            </Link>
            <Link
              href={"/sign-up"}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium text-base"
            >
              Start selling
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

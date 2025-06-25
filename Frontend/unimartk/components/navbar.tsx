"use client";

import { MenuIcon, MessageSquare, Moon, Sun } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { NavbarSidebar } from "./navbar-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useTheme } from "next-themes";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { UserProfile } from "@/modules/auth/types/auth";
import dynamic from "next/dynamic";
import path from "path";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const navbarItems = [
  { href: "/", children: "Home", slug: "home" },
  { href: "/skills", children: "Skills", slug: "skills" },
  { href: "/jobs", children: "Jobs", slug: "jobs" },
];

const NavbarItem = ({ children, href, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant={"ghost"}
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-primary/70"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const ClientLink = dynamic(
  () => import("@/components/client-link").then((m) => m.default),
  {
    ssr: false,
  }
);

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { isAuthenticated, user, logout, hasRole } = useAuth();
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
    <nav className="h-20 flex border-b justify-between font-medium px-6">
      <Link href={"/"} className=" flex items-center">
        <span className={cn("text-5xl  font-semibold", poppins.className)}>
          UniMarkt
        </span>
      </Link>

      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      <div className="items-center gap-2 xl:gap-4 hidden lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={
              item.slug === "skills"
                ? pathname.startsWith("/skillDetail") ||
                  pathname.startsWith("/skills")
                : item.slug === "jobs"
                  ? pathname.startsWith("/jobs") ||
                    pathname.startsWith("/jobDetail")
                  : !pathname.startsWith("/skills") &&
                    !pathname.startsWith("/jobs") &&
                    !pathname.startsWith("/skillDetail") &&
                    !pathname.startsWith("/jobDetail")
            }
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      {isAuthenticated ? (
        <div className="hidden lg:flex px-10 xl:px-12 gap-4 items-center">
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
                    alt={userProfile?.name || "User Avatar"}
                  />
                  <AvatarFallback>
                    {userProfile?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 ">
              <DropdownMenuLabel>
                {userProfile?.name || "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                Profile
              </DropdownMenuItem>
              {hasRole("admin") || hasRole("superuser") && (
                <DropdownMenuItem onClick={handleAdminDashboard}>
                  Admin Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="hidden lg:flex h-full gap-2 items-center">
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
          {/* <Button
            asChild
            variant="secondary"
            className="px-10 xl:px-12 transition-colors text-lg bg-primary max-w-32"
          > */}
          <ClientLink basePath="/sign-in">
            <Button className="">Log in</Button>
          </ClientLink>

          {/* </Button> */}

          <ClientLink basePath="/sign-up">
            <Button className="">Register</Button>
          </ClientLink>
        </div>
      )}

      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant={"ghost"}
          className="size-12 border-transparent"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

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
import dynamic from "next/dynamic";
import { UserProfile } from "@/modules/auth/types/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const navbarItems = [
  { href: "/", label: "Home", slug: "home" },
  { href: "/skills", label: "Skills", slug: "skills" },
  { href: "/jobs", label: "Jobs", slug: "jobs" },
];

const ClientLink = dynamic(
  () => import("@/components/client-link").then((m) => m.default),
  { ssr: false }
);

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { isAuthenticated, user, logout, hasRole } = useAuth();

  useEffect(() => {
    setUserProfile(user ?? null);
  }, [user]);

  const handleProfile = () => router.push("/profile");
  const handleAdminDashboard = () => router.push("/admin");
  const handleLogout = () => {
    logout();
    setUserProfile(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <nav className="h-16 flex items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
          <span className={cn("text-3xl font-bold tracking-tight", poppins.className)}>
            UniMarkt
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-2 xl:gap-4 list-none m-0 p-0">
          {navbarItems.map((item) => {
            const isActive =
              item.slug === "skills"
                ? pathname.startsWith("/skillDetail") || pathname.startsWith("/skills")
                : item.slug === "jobs"
                ? pathname.startsWith("/jobs") || pathname.startsWith("/jobDetail")
                : pathname === "/";
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "text-primary bg-primary/10 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Actions */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle theme">
                <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Authenticated User */}
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" asChild aria-label="Messages">
                <Link href="/messages">
                  <MessageSquare className="h-6 w-6" strokeWidth={1.5} />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full size-10" aria-label="User menu">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="https://i.pravatar.cc/150?img=3"
                        alt={userProfile && userProfile.name ? userProfile.name : "User Avatar"}
                      />
                      <AvatarFallback>{userProfile && userProfile.name ? userProfile.name.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{userProfile && userProfile.name ? userProfile.name : "My Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
                  {(hasRole("admin") || hasRole("superuser")) && (
                    <DropdownMenuItem onClick={handleAdminDashboard}>Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ClientLink basePath="/sign-in">
                <Button variant="outline">Log in</Button>
              </ClientLink>
              <ClientLink basePath="/sign-up">
                <Button variant="default">Register</Button>
              </ClientLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center justify-center">
          <Button
            variant="ghost"
            className="size-10 border-transparent"
            aria-label="Open menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>

        {/* Sidebar for mobile */}
        <NavbarSidebar
          items={navbarItems}
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />
      </nav>
    </header>
  );
};

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { UserProfile } from "@/modules/auth/types/auth";

interface NavbarItem {
  href: string;
  label: string;
  slug: string;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, onOpenChange, open }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { setTheme } = useTheme();

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none bg-background">
        <SheetHeader className="sticky top-0 z-10 p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold tracking-tight">UniMarkt</SheetTitle>
            {/* Optionally add a close button here */}
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          <nav className="flex flex-col gap-1 mt-2" aria-label="Mobile navigation">
            {items.map((item) => {
              const isActive =
                item.slug === "skills"
                  ? pathname.startsWith("/skillDetail") || pathname.startsWith("/skills")
                  : item.slug === "jobs"
                  ? pathname.startsWith("/jobs") || pathname.startsWith("/jobDetail")
                  : pathname === "/";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "w-full text-left px-5 py-3 rounded-lg font-medium text-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
                    (isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50")
                  }
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onOpenChange(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-4 flex flex-col gap-3">
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
                  {(hasRole && (hasRole("admin") || hasRole("superuser"))) && (
                    <DropdownMenuItem onClick={handleAdminDashboard}>Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href={"/sign-in"}
                className="w-full text-center py-3 rounded-lg font-medium text-base bg-background border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => onOpenChange(false)}
              >
                Log in
              </Link>
              <Link
                href={"/sign-up"}
                className="w-full text-center py-3 rounded-lg font-medium text-base bg-primary text-white hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => onOpenChange(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

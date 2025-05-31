"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { NavbarSidebar } from "./navbar-sidebar";

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
  { href: "/", children: "Home" },
  { href: "/skills", children: "Skills" },
  { href: "/jobs", children: "Jobs" },
];

const NavbarItem = ({ children, href, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant={"outline"}
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href={"/"} className="pl-6 flex items-center">
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
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      {true ? (
        <div className="hidden lg:flex ">
          <Button
            asChild
            variant={"secondary"}
            className="border-l border-t-0 border-b-0 border-r-0 px-10 xl:px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
          >
            <Link href={"/admin"}>Dashboard</Link>
          </Button>
          <Button
            onClick={() => {}}
            variant={"secondary"}
            className="border-l border-t-0 border-b-0 border-r-0 px-10 xl:px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="hidden lg:flex ">
          <Button
            asChild
            variant={"secondary"}
            className="border-l border-t-0 border-b-0 border-r-0 px-10 xl:px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
          >
            <Link prefetch href={"/sign-in"}>
              Log in
            </Link>
          </Button>
          <Button
            asChild
            variant={"secondary"}
            className="border-l border-t-0 border-b-0 border-r-0 px-10 xl:px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
          >
            <Link prefetch href={"/sign-up"}>
              Start Selling
            </Link>
          </Button>
        </div>
      )}

      <div className="flex lg:hidden items-center justify-center mr-6">
        <Button
          variant={"ghost"}
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

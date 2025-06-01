import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
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
          {true ? (
            <div className="border-t">
              <Link
                href={"/admin"}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium text-base"
              >
                Dashboard
              </Link>
              <div
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium text-base cursor-pointer"
                onClick={() => {}}
              >
                Logout
              </div>
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

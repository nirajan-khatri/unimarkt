"use client";

import { SearchIcon, ListFilterIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoriesSidebar } from "./categories-sidebar";
import { parseAsString, useQueryState } from "nuqs";

interface Props {
  disabled?: boolean;
}

export const searchParamsParsers = {
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};

export const SearchInput = ({ disabled }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useQueryState(
    "search",
    searchParamsParsers.search
  );

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          disabled={disabled}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Button
        variant={"outline"}
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
    </div>
  );
};

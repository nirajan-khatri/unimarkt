import { Footer } from "@/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { SearchFilters } from "@/modules/home/ui/components/search-filters";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SearchBar } from "@/modules/home/ui/components/SearchBar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
        <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;

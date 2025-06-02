import { Footer } from "@/components/Footer";
import { Navbar } from "@/modules/admin/ui/components/navbar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const layout = async ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;

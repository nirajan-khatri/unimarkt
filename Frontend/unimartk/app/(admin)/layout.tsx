import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import React from "react";
import AdminAccess from "./AdminAccess";

interface Props {
  children: React.ReactNode;
}

const layout = async ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <AdminAccess>{children}</AdminAccess>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default layout;

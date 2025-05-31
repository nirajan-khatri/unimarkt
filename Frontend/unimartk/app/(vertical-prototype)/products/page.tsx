import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row justify-between gap-10">
        <h1>Products</h1>
        <Button asChild>
          <Link href={"/products/create"}>Go to vertical Prototype</Link>
        </Button>
      </div>
      <div className=""></div>
    </div>
  );
};

export default page;

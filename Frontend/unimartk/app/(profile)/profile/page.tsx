import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div>
      <Button asChild>
        <Link href={"profile/create"}>Create a new Listing</Link>
      </Button>
    </div>
  );
};

export default Page;

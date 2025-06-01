import { redirect } from "next/navigation";
import React from "react";

import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
export const dynamic = "force-dynamic";

const Page = async () => {
  // if (user) {
  //   redirect("/");
  // }
  return <SignUpView />;
};

export default Page;

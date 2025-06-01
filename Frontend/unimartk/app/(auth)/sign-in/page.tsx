import { redirect } from "next/navigation";
import React from "react";

import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const Page = async () => {
  return <SignInView />;
};

export default Page;

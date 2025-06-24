// components/ClientLink.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ClientLink = ({
  basePath,
  children,
  classname,
}: {
  basePath: string;
  classname?: string;
  children: React.ReactNode;
}) => {
  const [href, setHref] = useState(basePath);

  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search;
    setHref(`${basePath}?redirect=${encodeURIComponent(currentPath)}`);
  }, [basePath]);

  return (
    <Link href={href} className={classname}>
      {children}
    </Link>
  );
};

export default ClientLink;

"use client";

import React from "react";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  value: number | string;
  href?: string; // Optional link
  onClick?: () => void; // Optional custom click handler
};

const AdminCard = ({ title, value, href, onClick, subtitle }: Props) => {
  const content = (
    <div
      className="flex flex-col items-center justify-center p-6 border border-border rounded-2xl shadow-sm bg-white/10 hover:shadow-md transition-all"
      onClick={onClick}
    >
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-muted-foreground text-sm mt-1">{title}</span>
      <span className="text-muted-foreground text-xs mt-1">{subtitle}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="cursor-pointer">
        {content}
      </Link>
    );
  }

  return <div className="cursor-default">{content}</div>;
};

export default AdminCard;

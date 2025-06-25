"use client";
import { useAuth } from "@/modules/auth/contexts/authContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAccess({ children }: { children: React.ReactNode }) {
  const { isInitialized, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const unauthorized =
    isInitialized && (!isAuthenticated || (user?.role !== "admin" && user?.role !== "superuser"));

  useEffect(() => {
    if (unauthorized) {
      // Try to go back, but if there's no history, go home
      router.back();
      const timeout = setTimeout(() => {
        router.replace("/");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [unauthorized, router]);

  if (!isInitialized) return null;
  if (unauthorized) return null;
  return <>{children}</>;
} 
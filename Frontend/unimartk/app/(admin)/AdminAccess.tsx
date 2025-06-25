"use client";
import { useAuth } from "@/modules/auth/contexts/authContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAccess({ children }: { children: React.ReactNode }) {
  const { isInitialized, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const unauthorized =
    isInitialized &&
    (!isAuthenticated || (user !== null && user.role !== "admin" && user.role !== "superuser"));

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || (user !== null && (user.role !== "admin" && user.role !== "superuser")))) {
      router.back();
      const timeout = setTimeout(() => {
        router.replace("/");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isInitialized, isAuthenticated, user, router]);

  if (!isInitialized || !isAuthenticated || user === null) return null;
  if (user.role !== "admin" && user.role !== "superuser") return null;
  return <>{children}</>;
} 
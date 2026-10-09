import type { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function AdminAccess({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, user } = useAuth();
  if (isLoading) return <p role="status" className="min-h-[60vh] pt-32 text-center">Checking admin session…</p>;
  if (!isAuthenticated) return <Redirect to="/admin/login" />;
  if (user?.role !== "admin") return <p role="alert" className="min-h-[60vh] pt-32 text-center">Administrator access is required.</p>;
  return <>{children}</>;
}
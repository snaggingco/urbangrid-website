import { Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

export default function AdminLogin() {
  const { user } = useAuth();
  const { data: config, isError } = useQuery<{ username: string; csrfToken: string }>({
    queryKey: ["/api/admin/login-config"],
    queryFn: async () => {
      const response = await fetch("/api/admin/login-config", { credentials: "include" });
      if (!response.ok) throw new Error("Sign-in unavailable");
      return response.json();
    },
    enabled: user?.role !== "admin", retry: false, staleTime: 0,
  });
  if (user?.role === "admin") return <Redirect to="/admin" />;
  const failed = new URLSearchParams(window.location.search).get("error") === "1";
  return (
    <div className="min-h-[70vh] px-6 pt-32 pb-20">
      <section className="mx-auto max-w-md rounded-lg border border-zinc-200 bg-white p-8">
        <p className="text-sm font-semibold text-brand-green">UrbanGrid</p>
        <h1 className="mt-3 text-2xl font-bold">Admin sign in</h1>
        <p className="mt-2 text-sm text-zinc-600">Access the sales funnel and administration tools.</p>
        {failed && <p role="alert" className="mt-4 text-sm text-red-700">Sign-in failed. Check your username and password.</p>}
        {isError && <p role="alert" className="mt-4 text-sm text-red-700">Could not initialize secure sign-in. Refresh the page to try again.</p>}
        <form method="POST" action="/api/admin/login" className="mt-6 space-y-5">
          <input type="hidden" name="csrfToken" value={config?.csrfToken || ""} />
          <label className="block text-sm font-medium">Admin email
            <Input name="username" type="email" value="info@urbangrid.ae" readOnly autoComplete="username" required className="mt-2" />
          </label>
          <label className="block text-sm font-medium">Password
            <Input name="password" type="password" autoComplete="current-password" required className="mt-2" />
          </label>
          <Button type="submit" disabled={!config?.csrfToken} className="w-full">{config?.csrfToken ? "Sign in" : "Preparing secure sign-in…"}</Button>
        </form>
      </section>
    </div>
  );
}
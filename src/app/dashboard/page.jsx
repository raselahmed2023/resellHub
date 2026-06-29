"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    const timer = setTimeout(() => {
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const role = session.user.role || "buyer";

      if (role === "buyer") router.replace("/dashboard/buyer");
      else if (role === "seller") router.replace("/dashboard/seller");
      else if (role === "admin") router.replace("/dashboard/admin");
      else router.replace("/dashboard/buyer");
    }, 500);

    return () => clearTimeout(timer);
  }, [session, isPending, router]);

  return <div>Loading...</div>;
}
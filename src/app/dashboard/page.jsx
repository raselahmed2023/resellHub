"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session) { router.push("/login"); return; }

    const role = session.user.role;
    if (role === "buyer") router.push("/dashboard/buyer");
    else if (role === "seller") router.push("/dashboard/seller");
    else if (role === "admin") router.push("/dashboard/admin");
    else router.push("/login");
  }, [session, isPending]);

  if (isPending) return <div>Loading...</div>;
  return null;
}
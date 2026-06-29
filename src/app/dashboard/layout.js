import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();

  const allCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  let session = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: allCookies,
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      session = await res.json();
    }
  } catch (err) {
    console.log(err);
  }

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <Sidebar role={session.user.role || "buyer"} user={session.user} />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
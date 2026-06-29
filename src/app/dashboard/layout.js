import Sidebar from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({ children }) {
  const headersList = await headers();
  
 
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
    headers: Object.fromEntries(headersList.entries()),
    cache: 'no-store',
  });
  
  const session = res.ok ? await res.json() : null;

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role={session.user.role} user={session.user} />
      <main style={{ flex: 1, padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}
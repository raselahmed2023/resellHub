import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  let session = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
      {
        headers: { cookie: allCookies },
        cache: 'no-store',
      }
    );
    if (res.ok) session = await res.json();
  } catch (err) {}

  if (!session?.user) redirect('/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar role={session.user.role} user={session.user} />
      <main style={{ flex: 1, padding: '32px' }}>{children}</main>
    </div>
  );
}
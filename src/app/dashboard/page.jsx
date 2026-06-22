import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log('SESSION:', session);
  console.log('ROLE:', session?.user?.role);

  if (!session) redirect('/login');

  const role = session.user.role;

  if (role === 'buyer') redirect('/dashboard/buyer');
  if (role === 'seller') redirect('/dashboard/seller');
  if (role === 'admin') redirect('/dashboard/admin');

  redirect('/login');
}
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Heart, CreditCard, User, PlusCircle, List, Truck, BarChart3, Users, LogOut } from 'lucide-react';
import { Chip } from "@heroui/react";
import { CircleCheckFill} from "@gravity-ui/icons";
import { signOut } from '@/lib/auth-client';



const menuConfig = {
  buyer: [
    { label: 'Overview', href: '/dashboard/buyer', icon: LayoutDashboard },
    { label: 'My Orders', href: '/dashboard/buyer/orders', icon: Package },
    { label: 'Wishlist', href: '/dashboard/buyer/wishlist', icon: Heart },
    { label: 'Payments', href: '/dashboard/buyer/payments', icon: CreditCard },
    { label: 'Profile', href: '/dashboard/buyer/profile', icon: User },
  ],
  seller: [
    { label: 'Overview', href: '/dashboard/seller', icon: LayoutDashboard },
    { label: 'Add Product', href: '/dashboard/seller/add-product', icon: PlusCircle },
    { label: 'My Products', href: '/dashboard/seller/my-products', icon: List },
    { label: 'Manage Orders', href: '/dashboard/seller/manage-orders', icon: Truck, badge: '3' },
    { label: 'Analytics', href: '/dashboard/seller/analytics', icon: BarChart3 },
    { label: 'Profile', href: '/dashboard/seller/profile', icon: User },
  ],
  admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Manage Products', href: '/dashboard/admin/products', icon: List },
    { label: 'Manage Orders', href: '/dashboard/admin/orders', icon: Truck },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  ]
};

export default function Sidebar({ role, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = menuConfig[role] || [];

  const handleSignOut = async () => {
      await signOut({
        fetchOptions: { onSuccess: () => router.push("/") },
      });
     
    };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col font-sans">

      <Link href="/" className="flex items-center text-center justify-center gap-2 mt-4">
        <span className="font-extrabold text-lg text-gray-900">
          Re<span className="text-emerald-500">Sell</span> Hub
        </span>
      </Link>

       <Chip color="success" className="flex flex-wrap text-center items-center justify-center font-black uppercase gap-3">
        <CircleCheckFill width={12} />
        <Chip.Label>{role} Account</Chip.Label>
      </Chip>

      {/* User Info */}
      <div className="p-5 px-6 py-4 flex items-center gap-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-black font-bold text-sm shadow-sm">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'User'}</p>
          <p className="text-[11px] text-gray-500">{user?.email}</p>
        </div>

      </div>

      {/* Premium Badge */}
      
      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-red-600 w-full transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
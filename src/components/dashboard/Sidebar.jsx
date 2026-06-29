"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  CreditCard,
  User,
  PlusCircle,
  List,
  Truck,
  BarChart3,
  Users,
  LogOut,
} from "lucide-react";
import { Chip } from "@heroui/react";
import { CircleCheckFill } from "@gravity-ui/icons";
import { signOut, useSession } from "@/lib/auth-client";

const menuConfig = {
  buyer: [
    { label: "Overview", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/buyer/orders", icon: Package },
    { label: "Wishlist", href: "/dashboard/buyer/wishlist", icon: Heart },
    { label: "Payments", href: "/dashboard/buyer/payments", icon: CreditCard },
    { label: "Profile", href: "/dashboard/buyer/profile", icon: User },
  ],

  seller: [
    { label: "Overview", href: "/dashboard/seller", icon: LayoutDashboard },
    {
      label: "Add Product",
      href: "/dashboard/seller/add-product",
      icon: PlusCircle,
    },
    {
      label: "My Products",
      href: "/dashboard/seller/my-products",
      icon: List,
    },
    {
      label: "Manage Orders",
      href: "/dashboard/seller/manage-orders",
      icon: Truck,
      badge: "3",
    },
    {
      label: "Analytics",
      href: "/dashboard/seller/analytics",
      icon: BarChart3,
    },
    { label: "Profile", href: "/dashboard/seller/profile", icon: User },
  ],

  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Products", href: "/dashboard/admin/products", icon: List },
    { label: "Manage Orders", href: "/dashboard/admin/orders", icon: Truck },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  ],
};

export default function Sidebar({ role, user }) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: clientSession } = useSession();
  const currentUser = user || clientSession?.user;

  const pathRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/seller")
    ? "seller"
    : pathname.startsWith("/dashboard/buyer")
    ? "buyer"
    : role || currentUser?.role || "buyer";

  const menuItems = menuConfig[pathRole] || menuConfig.buyer;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col font-sans">
      {/* Logo + Role */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Link
          href="/"
          className="flex items-center justify-center md:justify-start gap-2 mb-3"
        >
          <span className="font-extrabold text-lg text-gray-900">
            Re<span className="text-emerald-500">Sell</span> Hub
          </span>
        </Link>

        <div className="flex justify-center md:justify-start">
          <Chip
            color="success"
            className="font-black uppercase text-xs flex items-center gap-2"
          >
            <CircleCheckFill width={12} />
            {pathRole.toUpperCase()} ACCOUNT
          </Chip>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        {currentUser?.image ? (
          <img
            src={currentUser.image}
            alt={currentUser?.name || "User"}
            className="w-10 h-10 rounded-full object-cover shadow-sm border border-emerald-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {currentUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-tight truncate">
            {currentUser?.name || "User"}
          </p>
          <p className="text-[11px] text-gray-500 truncate">
            {currentUser?.email || ""}
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 md:p-4 flex md:block gap-2 md:space-y-1 overflow-x-auto md:overflow-visible">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${pathRole}` &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 md:shrink flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />

              <span>{item.label}</span>

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
      <div className="p-3 md:p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
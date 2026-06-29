import { CircleCheckFill } from "@gravity-ui/icons";
import { Chip } from "@heroui/react";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ role, user }) {
  const pathname = usePathname();
  const router = useRouter();

  const pathRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/seller")
    ? "seller"
    : pathname.startsWith("/dashboard/buyer")
    ? "buyer"
    : role || "buyer";

  const menuItems = menuConfig[pathRole] || menuConfig.buyer;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
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
        <Chip.Label>{pathRole.toUpperCase()} ACCOUNT</Chip.Label>
      </Chip>

      <div className="p-5 px-6 py-4 flex items-center gap-3 border-b border-gray-100">
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">
            {user?.name || "User"}
          </p>
          <p className="text-[11px] text-gray-500">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-red-600 w-full transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
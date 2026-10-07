"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Package, 
  Heart, 
  MessageSquare, 
  Wallet, 
  Settings 
} from "@/lib/lucide";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Огляд", icon: User },
    { href: "/dashboard/orders", label: "Мої покупки", icon: Package },
    { href: "/dashboard/favorites", label: "Обране", icon: Heart },
    { href: "/dashboard/messages", label: "Повідомлення", icon: MessageSquare },
    { href: "/dashboard/wallet", label: "Баланс", icon: Wallet },
    { href: "/dashboard/settings", label: "Налаштування", icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="card p-3 md:sticky md:top-24">
        <div className="text-[11px] text-gray-500 font-semibold px-3 mb-2 mt-1 uppercase tracking-wider">
          Особистий кабінет
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-gray-500"}`}
              />
              <span>{link.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

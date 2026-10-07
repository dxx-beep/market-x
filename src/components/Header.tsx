import Link from "next/link";
import { Search, ShoppingCart, LogOut } from "@/lib/lucide";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions";
import { UserBadges } from "@/components/UserBadge";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-gray-800/80 bg-[#0a0a0a]/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 grid place-items-center text-white font-black text-sm shadow-lg shadow-violet-950/50 group-hover:scale-105 transition">
              X
            </span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-500">
              MarketX
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm text-gray-400">
            <Link href="/catalog" className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition">Каталог</Link>
            <Link href="/forum" className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition">Форум</Link>
            {user && ["SELLER", "ADMIN"].includes(user.role) ? (
              <Link href="/seller" className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition">Продавцю</Link>
            ) : null}
          </nav>
        </div>

        <form action="/catalog" className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
            <input
              name="q"
              placeholder="Пошук товарів..."
              className="w-full bg-[#141416] border border-gray-800 rounded-full py-2 pl-9 pr-4 text-sm outline-none transition placeholder:text-gray-500 hover:border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition">
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-gray-800 hover:border-gray-700 hover:bg-white/5 transition group">
                <span className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 group-hover:ring-white/30 transition">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Аватар" className="w-full h-full object-cover" />
                  ) : (
                    user.username.slice(0, 1).toUpperCase()
                  )}
                </span>
                <div className="flex flex-col items-end leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-200 font-medium group-hover:text-white transition">{user.username}</span>
                    <UserBadges badges={(user as any).badges} role={user.role} max={3} overflow variant="icon" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 font-mono">${user.balance.toFixed(2)}</span>
                </div>
              </Link>
              <form action={logoutAction}>
                <button title="Вийти" className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-sm">
              Увійти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

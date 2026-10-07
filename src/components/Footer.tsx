import Link from "next/link";
import { Discord, ShoppingBag } from "@/lib/lucide";

const columns = [
  {
    title: "Маркетплейс",
    links: [
      { href: "/catalog", label: "Каталог" },
      { href: "/catalog?sort=price", label: "Найдешевші товари" },
      { href: "/cart", label: "Кошик" },
    ],
  },
  {
    title: "Спільнота",
    links: [
      { href: "/forum", label: "Форум" },
      { href: "/register", label: "Стати продавцем" },
      { href: "/dashboard/favorites", label: "Обране" },
    ],
  },
  {
    title: "Підтримка",
    links: [
      { href: "/dashboard/messages", label: "Зв'язатися з нами" },
      { href: "/dashboard/orders", label: "Мої замовлення" },
      { href: "/dashboard/settings", label: "Налаштування" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-[#0c0c0c]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 grid place-items-center text-white font-black text-sm shadow-lg shadow-violet-950/50">
                X
              </span>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-500">
                MarketX
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs">
              Маркетплейс цифрових товарів з безпечними угодами, миттєвою видачею та
              підтримкою 24/7.
            </p>
            <a
              href="/api/auth/discord"
              className="mt-5 inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
            >
              <Discord className="w-4 h-4 text-[#5865F2]" /> Приєднуйтесь до Discord
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-500 hover:text-violet-300 transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>
            &copy; {new Date().getFullYear()} MarketX. Усі права захищені.
          </span>
          <span className="inline-flex items-center gap-1.5 text-gray-500">
            <ShoppingBag className="w-3.5 h-3.5 text-violet-500" />
            Зроблено для цифрової торгівлі
          </span>
        </div>
      </div>
    </footer>
  );
}

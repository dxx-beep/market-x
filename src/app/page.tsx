import Link from "next/link";
import { db } from "@/lib/db";
import { ChevronRight, Gamepad2, Discord, Send, Cpu, ShoppingBag, Gift, Share2, Terminal, Zap, Star } from "@/lib/lucide";

export default async function Home() {
  const categories = [
    { name: "Discord", slug: "discord", icon: <Discord className="w-6 h-6 text-[#5865F2]" />, count: 3 },
    { name: "Telegram", slug: "telegram", icon: <Send className="w-6 h-6 text-[#229ED9]" />, count: 1 },
    { name: "AI", slug: "ai", icon: <Cpu className="w-6 h-6 text-purple-400" />, count: 1 },
    { name: "Games", slug: "games", icon: <Gamepad2 className="w-6 h-6 text-green-400" />, count: 1 },
    { name: "Social Media", slug: "social-media", icon: <Share2 className="w-6 h-6 text-pink-400" />, count: 0 },
    { name: "Gift Cards", slug: "gift-cards", icon: <Gift className="w-6 h-6 text-yellow-400" />, count: 1 },
    { name: "Software", slug: "software", icon: <Terminal className="w-6 h-6 text-blue-400" />, count: 1 },
    { name: "Other", slug: "other", icon: <ShoppingBag className="w-6 h-6 text-gray-400" />, count: 0 },
  ];

  const popularProducts = await db.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      category: true,
      images: true,
      seller: { include: { user: true } },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-14 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#121216_0%,#0a0a0a_60%)]"></div>

        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300 animate-fade-in">
          <Zap className="w-3.5 h-3.5" /> Миттєва видача · Безпечна угода
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 mt-6 tracking-tight animate-fade-in-up">
          Маркетплейс <br />
          <span className="text-gradient">цифрових товарів</span>
        </h1>
        <p
          className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Купуй та продавай цифрові товари швидко та зручно. Безпечні угоди, миттєва доставка,
          надійна підтримка.
        </p>
        <div
          className="flex justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Link href="/catalog" className="btn-primary text-lg px-8 py-3">
            Перейти до каталогу
          </Link>
          <Link href="/seller" className="btn-ghost text-lg px-8 py-3">
            Стати продавцем
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { value: "10K+", label: "Товарів" },
            { value: "2.4K", label: "Продавців" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Підтримка" },
          ].map((s) => (
            <div
              key={s.label}
              className="card px-4 py-4 text-center bg-[#121214]"
            >
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Категорії</h2>
          <Link href="/catalog" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
            Всі категорії <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              href={`/catalog?category=${cat.slug}`}
              key={i}
              className="card p-5 group flex flex-col items-start text-center gap-3.5 !bg-[#121214]"
            >
              <div className="icon-tile w-12 h-12 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="text-left w-full">
                <div className="flex items-center justify-between w-full">
                  <h3 className="font-semibold text-gray-200 group-hover:text-violet-300 transition">
                    {cat.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {cat.count} {cat.count === 1 ? "товар" : "товарів"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Популярні товари</h2>
            <p className="text-gray-500 text-sm mt-1">Топ продажів за останні 24 години</p>
          </div>
          <Link href="/catalog" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
            Дивитись усі <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((p) => {
            const img = p.images[0]?.url;

            return (
              <Link
                href={`/product/${p.id}`}
                key={p.id}
                className="card overflow-hidden group flex flex-col"
              >
                <div className="h-48 bg-[#101012] relative overflow-hidden flex items-center justify-center">
                  {img ? (
                    <img
                      src={img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1b1b20] to-[#141417] flex items-center justify-center text-5xl text-gray-600">
                      ✦
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute top-2.5 right-2.5 bg-violet-600 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                    TOP
                  </div>
                  {p.type === "AUTOMATIC" && (
                    <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur text-violet-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
                      <Zap className="w-3 h-3 text-violet-400" /> Миттєво
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-violet-400 font-medium mb-1.5">{p.category.name}</div>
                    <h3 className="font-medium text-gray-200 group-hover:text-violet-300 transition line-clamp-2 mb-2">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4 border-t border-gray-800/80 pt-3">
                    <span className="text-xl font-bold text-white">${p.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" /> {p.seller.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

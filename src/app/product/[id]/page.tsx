import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { addToCartAction, toggleFavoriteAction } from "@/app/actions";
import { Zap, ShieldCheck, Heart } from "@/lib/lucide";
import { UserBadges } from "@/components/UserBadge";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const p = await db.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      category: true,
      seller: {
        include: {
          user: {
            include: {
              badges: {
                include: { badge: true },
                orderBy: { badge: { priority: "desc" } },
              },
            },
          },
        },
      },
      images: true,
      reviews: {
        include: {
          author: {
            include: {
              badges: {
                include: { badge: true },
                orderBy: { badge: { priority: "desc" } },
              },
            },
          },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!p) notFound();

  const imageUrl = p.images[0]?.url;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Link href="/catalog" className="back-link">← Повернутися до каталогу</Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image / Banner */}
        <div className="space-y-4">
          <div className="card overflow-hidden h-80 sm:h-96 flex items-center justify-center bg-[#101012] relative shadow-xl shadow-black/40">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={p.title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1b1b20] to-[#141417] flex items-center justify-center text-7xl text-gray-600">
                ✦
              </div>
            )}
            {p.type === "AUTOMATIC" && (
              <div className="absolute top-4 left-4 bg-black/70 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur flex items-center gap-1.5 border border-white/10">
                <Zap className="w-3.5 h-3.5" /> Миттєва видача
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
              {p.category.name}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
              {p.title}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {p.description}
            </p>
          </div>

          <div className="space-y-4 border-y border-gray-800/80 py-6">
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <Zap className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{p.type === "AUTOMATIC" ? "Система автоматично видасть цифровий код після оплати" : "Продавець видасть товар протягом короткого часу"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
              <span>Безпечна угода через гаранта MarketX</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#121214] px-5 py-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                ${p.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {p.stock > 0 ? (
                  <span className="text-emerald-400">● {p.stock} шт. в наявності</span>
                ) : (
                  <span className="text-red-400">● Немає в наявності</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <form action={toggleFavoriteAction}>
                <input type="hidden" name="productId" value={p.id} />
                <button
                  type="submit"
                  title="Додати в обране"
                  className="p-3 rounded-lg border border-gray-800 bg-[#17171a] hover:bg-[#202024] hover:border-gray-700 text-gray-400 hover:text-rose-400 transition"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </form>

              <form action={addToCartAction}>
                <input type="hidden" name="productId" value={p.id} />
                <button
                  disabled={!p.stock}
                  className="btn-primary py-3 px-6 text-sm font-semibold disabled:opacity-50"
                >
                  Додати в кошик
                </button>
              </form>
            </div>
          </div>

          {/* Seller Block */}
          <div className="card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block">Продавець</span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-semibold text-gray-200">{p.seller.user.username}</span>
                <UserBadges
                  badges={(p.seller.user as any).badges}
                  role={p.seller.user.role}
                  max={3}
                  overflow
                  variant="pill"
                  size="sm"
                />
                <span className="text-yellow-400 text-xs font-normal">
                  ★ {p.seller.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {p.seller.totalSales} успішних продажів
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="card p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Відгуки покупців</h2>
        {p.reviews.length ? (
          <div className="space-y-3">
            {p.reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-800/80 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-200">{r.author.username}</span>
                  <span className="text-yellow-400 text-xs">★ {r.rating}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{r.text || "Швидко і надійно!"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Цей товар щойно додано на платформу. Будьте першим, хто залишить відгук!</p>
        )}
      </section>
    </div>
  );
}

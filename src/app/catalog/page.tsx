import Link from "next/link";
import { db } from "@/lib/db";
import { Filter, Search } from "@/lib/lucide";

export default async function Catalog({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const p = await searchParams;

  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
      ...(p.q ? { title: { contains: p.q } } : {}),
      ...(p.category ? { category: { slug: p.category } } : {}),
    },
    include: {
      category: true,
      seller: { include: { user: true } },
      images: true,
    },
    orderBy: p.sort === "price" ? { price: "asc" } : { createdAt: "desc" },
  });

  const cats = await db.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-7">
      <div className="relative overflow-hidden rounded-2xl border border-gray-800/80 bg-[#141417] p-7">
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/25 rounded-full px-3 py-1">
            <Filter className="w-3.5 h-3.5" /> {products.length} товарів
          </span>
          <h1 className="text-3xl font-bold mt-3">Каталог цифрових товарів</h1>
          <p className="text-gray-400 mt-2">
            Миттєва та безпечна видача від перевірених продавців
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/catalog"
          className={`chip ${!p.category ? "chip-active" : ""}`}
        >
          Всі
        </Link>
        {cats.map((c) => {
          const isActive = p.category === c.slug;
          return (
            <Link
              key={c.id}
              href={`/catalog?category=${c.slug}`}
              className={`chip ${isActive ? "chip-active" : ""}`}
            >
              {c.name}
            </Link>
          );
        })}
        <Link
          href="/catalog?sort=price"
          className={`chip ${p.sort === "price" ? "chip-active" : ""}`}
        >
          Найдешевші
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const imageUrl = product.images[0]?.url;

          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="card overflow-hidden group flex flex-col"
            >
              <div className="h-44 bg-[#101012] relative overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1b1b20] to-[#141417] flex items-center justify-center text-4xl text-gray-600">
                    ✦
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                {product.discount > 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-rose-600 to-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    -{product.discount}%
                  </span>
                )}
                {product.type === "AUTOMATIC" && (
                  <span className="absolute bottom-2.5 left-2.5 bg-black/70 text-violet-300 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur border border-white/10">
                    ⚡ Миттєва видача
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-violet-400 mb-1.5 font-medium">{product.category.name}</div>
                  <h2 className="font-semibold text-gray-100 group-hover:text-violet-300 transition line-clamp-2 mb-2">
                    {product.title}
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    {product.seller.user.username} ·{" "}
                    <span className="text-amber-400">★ {product.seller.rating.toFixed(1)}</span>
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-800/80 pt-3">
                  <div>
                    <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {product.stock > 0 ? "В наявності" : "Закінчився"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!products.length && (
        <div className="card p-14 text-center">
          <div className="icon-tile w-14 h-14 mx-auto mb-4">
            <Search className="w-6 h-6 text-violet-300" />
          </div>
          <p className="text-lg font-medium text-gray-200">Товарів не знайдено</p>
          <p className="text-sm text-gray-500 mt-1">Спробуйте змінити запит або фільтр категорії.</p>
          <div className="mt-5">
            <Link href="/catalog" className="btn-primary text-sm">
              Скинути фільтри
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

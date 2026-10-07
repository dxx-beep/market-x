import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { toggleFavoriteAction, addToCartAction } from "@/app/actions";

export default async function DashboardFavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const favorites = await db.favorite.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          category: true,
          seller: { include: { user: true } },
          images: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Обране</h1>
        <p className="text-gray-500 text-sm mt-1">Товари, які ви зберегли для швидкого доступу.</p>
      </div>

      {favorites.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map(({ product }) => (
            <div key={product.id} className="card overflow-hidden group flex flex-col justify-between">
              <div>
                <Link href={`/product/${product.id}`} className="block h-36 bg-[#121212] relative overflow-hidden">
                  {product.images[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1b1b20] to-[#141417] flex items-center justify-center text-4xl text-gray-600">
                      ✦
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <div className="text-xs text-purple-400">{product.category.name}</div>
                  <Link
                    href={`/product/${product.id}`}
                    className="font-semibold block mt-1 hover:text-purple-300 transition line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  <p className="text-sm text-gray-400 mt-2 font-medium">
                    ${product.price.toFixed(2)}{" "}
                    <span className="text-gray-500 text-xs">· {product.seller.user.username}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex gap-2">
                  <form action={addToCartAction} className="flex-1">
                    <input type="hidden" name="productId" value={product.id} />
                    <button className="btn-primary w-full text-sm">У кошик</button>
                  </form>
                  <form action={toggleFavoriteAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      title="Видалити з обраного"
                      className="px-3 py-1.5 rounded-lg border border-gray-700 text-red-400 hover:bg-red-500/10 transition"
                    >
                      ♥
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-gray-500">
          <p className="text-base">Ти ще не додав жодного товару в обране.</p>
          <div className="mt-4">
            <Link href="/catalog" className="btn-primary inline-block text-sm">
              Переглянути каталог
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

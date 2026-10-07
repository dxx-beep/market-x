import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { removeFromCartAction } from "@/app/actions";
import { Trash2, ShieldCheck } from "@/lib/lucide";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const { error } = await searchParams;

  if (!user) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-3">Ваш кошик</h1>
        <p className="text-gray-400 mb-6">Увійдіть, щоб зберігати товари та оформлювати замовлення.</p>
        <Link href="/login" className="btn-primary">Увійти</Link>
      </div>
    );
  }

  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          seller: { include: { user: true } },
          images: true,
        },
      },
    },
  });

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Кошик</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!items.length ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-lg">Кошик порожній.</p>
          <div className="mt-4">
            <Link href="/catalog" className="btn-primary inline-block text-sm">
              Перейти до каталогу
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {items.map((i) => {
              const img = i.product.images[0]?.url;

              return (
                <div key={i.id} className="card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-[#121212] overflow-hidden shrink-0 border border-gray-800">
                      {img ? (
                        <img src={img} alt={i.product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-gray-600">✦</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-purple-400 font-medium">{i.product.seller.user.username}</div>
                      <Link href={`/product/${i.product.id}`} className="font-semibold text-gray-200 hover:text-purple-300 transition line-clamp-1 mt-0.5">
                        {i.product.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">Кількість: {i.quantity} шт.</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-800">
                    <div className="font-bold text-lg text-white">
                      ${(i.product.price * i.quantity).toFixed(2)}
                    </div>
                    <form action={removeFromCartAction} className="mt-2">
                      <input type="hidden" name="productId" value={i.productId} />
                      <button className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition">
                        <Trash2 className="w-3.5 h-3.5" /> Видалити
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card p-6 w-full lg:w-80 h-fit space-y-4">
            <h2 className="font-bold text-lg border-b border-gray-800 pb-3">Підсумок замовлення</h2>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Товари ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Комісія</span>
              <span className="text-green-400">$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-800 pt-3">
              <span>Разом</span>
              <span className="text-green-400">${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="block btn-primary text-center py-2.5 font-semibold">
              Перейти до оплати
            </Link>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <span>Ваш баланс:</span>
              <span className="font-semibold text-gray-300">${user.balance.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 justify-center pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Безпечна оплата через баланс
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

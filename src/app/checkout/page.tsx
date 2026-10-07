import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkoutAction } from "@/app/actions";
import { Lock } from "@/lib/lucide";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user)
    return (
      <div className="text-center py-20">
        <p className="mb-4 text-gray-400">Для оплати потрібно увійти.</p>
        <Link href="/login" className="btn-primary">
          Увійти
        </Link>
      </div>
    );

  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Підтвердження замовлення</h1>
      <p className="text-gray-500 text-sm mb-7">Перевірте товари перед оплатою</p>

      <div className="card p-6">
        <div className="space-y-3 mb-6">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex justify-between text-sm bg-[#121214] border border-gray-800/70 rounded-lg px-3.5 py-2.5"
            >
              <span className="text-gray-300">
                {i.product.title} × {i.quantity}
              </span>
              <span className="font-medium">${(i.product.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-4 flex justify-between text-xl font-bold">
          <span>До сплати</span>
          <span className="text-emerald-400">${total.toFixed(2)}</span>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Ваш баланс:{" "}
          <span className="font-semibold text-gray-300">${user.balance.toFixed(2)}</span>
        </p>

        <form action={checkoutAction}>
          <button className="w-full btn-primary mt-6">Підтвердити оплату</button>
        </form>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 mt-4">
          <Lock className="w-3.5 h-3.5 text-emerald-400" /> Безпечна оплата через баланс MarketX
        </p>
      </div>
    </div>
  );
}

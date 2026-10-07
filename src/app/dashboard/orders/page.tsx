import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await db.order.findMany({
    where: { buyerId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Мої покупки</h1>
        <p className="text-gray-500 text-sm mt-1">Історія ваших замовлень та статус виконання.</p>
      </div>

      <div className="space-y-3">
        {orders.length ? (
          orders.map((o) => (
            <div key={o.id} className="card p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-200">
                  {o.items.map((i) => i.product.title).join(", ")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {o.createdAt.toLocaleDateString("uk-UA")} · #{o.id.slice(-8)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-400">${o.totalAmount.toFixed(2)}</p>
                <p className="text-xs text-green-400/80 mt-1">
                  {o.status === "COMPLETED" ? "Виконано" : o.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center text-gray-500">
            <p className="text-base">Тут з&apos;являться твої покупки.</p>
            <div className="mt-4">
              <Link href="/catalog" className="btn-primary inline-block text-sm">
                Перейти до каталогу
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

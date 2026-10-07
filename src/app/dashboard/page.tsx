import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Package, Wallet, ShoppingBag } from "@/lib/lucide";
import { UserBadges } from "@/components/UserBadge";

export default async function BuyerDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await db.order.findMany({
    where: { buyerId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const purchases = await db.order.count({ where: { buyerId: user.id } });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-100">
            Привіт, {user.username} 👋
          </h1>
          <UserBadges badges={(user as any).badges} role={user.role} max={4} overflow variant="pill" size="md" />
        </div>
        <p className="text-gray-500 mt-1">Ось що відбувається у твоєму акаунті MarketX.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <Wallet className="text-green-400 w-5 h-5 mb-4" />
          <p className="text-sm text-gray-500">Баланс</p>
          <p className="text-2xl font-bold text-green-400">${user.balance.toFixed(2)}</p>
        </div>
        <div className="card p-5">
          <Package className="text-purple-400 w-5 h-5 mb-4" />
          <p className="text-sm text-gray-500">Покупок</p>
          <p className="text-2xl font-bold">{purchases}</p>
        </div>
        <div className="card p-5">
          <ShoppingBag className="text-blue-400 w-5 h-5 mb-4" />
          <p className="text-sm text-gray-500">Статус</p>
          <p className="text-2xl font-bold">Активний</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Останні покупки</h2>
          <Link href="/dashboard/orders" className="text-sm text-purple-400 hover:text-purple-300 transition">
            Переглянути всі
          </Link>
        </div>
        {orders.length ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-gray-800 pb-3"
              >
                <div>
                  <p className="font-medium text-gray-200">
                    {order.items[0]?.product.title || "Замовлення"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.createdAt.toLocaleDateString("uk-UA")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-100">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-green-400">Виконано</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Покупок ще немає.{" "}
            <Link href="/catalog" className="text-purple-400 hover:text-purple-300">
              Перейти до каталогу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

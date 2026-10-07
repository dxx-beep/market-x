import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function WalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const txs = await db.walletTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Баланс та Гаманець</h1>
        <p className="text-gray-500 text-sm mt-1">Керування коштами та історія транзакцій.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-6">
          <p className="text-sm text-gray-500 font-medium">Доступний баланс</p>
          <p className="text-3xl font-bold text-green-400 mt-2">${user.balance.toFixed(2)}</p>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary text-xs py-2 px-4">Поповнити</button>
            <button className="px-4 py-2 text-xs rounded-lg border border-gray-700 hover:bg-[#202020] transition text-gray-300">Вивести</button>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500 font-medium">Заморожений баланс</p>
          <p className="text-3xl font-bold text-gray-400 mt-2">$0.00</p>
          <p className="text-xs text-gray-600 mt-4">Кошти в активних угодах або на перевірці</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Історія операцій</h2>
        {txs.length ? (
          <div className="divide-y divide-gray-800">
            {txs.map((t) => (
              <div key={t.id} className="flex justify-between py-3 text-sm">
                <div>
                  <span className="font-medium text-gray-200">{t.type}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{t.createdAt.toLocaleDateString("uk-UA")}</p>
                </div>
                <span className={`font-semibold ${t.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {t.amount > 0 ? "+" : ""}${t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Операцій ще немає.</p>
        )}
      </div>
    </div>
  );
}

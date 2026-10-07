import Link from "next/link";
import { DollarSign, ShoppingBag, TrendingUp, Star } from "@/lib/lucide";

export default function SellerDashboard() {
  const stats = [
    { name: "Баланс", value: "$450.00", icon: <DollarSign className="w-5 h-5 text-green-400" /> },
    { name: "Продажі за 30 днів", value: "124", icon: <ShoppingBag className="w-5 h-5 text-purple-400" /> },
    { name: "Дохід (30 днів)", value: "$1,240.50", icon: <TrendingUp className="w-5 h-5 text-blue-400" /> },
    { name: "Рейтинг", value: "4.9", icon: <Star className="w-5 h-5 text-yellow-400" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-2">
        <div className="card p-4 space-y-1">
          <div className="text-xs text-gray-500 font-bold px-3 mb-2 uppercase">Панель продавця</div>
          <Link href="/seller" className="block px-3 py-2 rounded bg-purple-500/10 text-purple-400 font-medium">Огляд</Link>
          <Link href="/seller/products" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Товари</Link>
          <Link href="/seller/orders" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Замовлення</Link>
          <Link href="/seller/finance" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Баланс та Виведення</Link>
          <Link href="/seller/settings" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Налаштування</Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <h1 className="text-2xl font-bold">Огляд продавця</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="card p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">{s.name}</div>
                <div className="text-2xl font-bold">{s.value}</div>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-full">{s.icon}</div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Останні замовлення</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-[#171717] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Товар</th>
                  <th className="px-4 py-3">Покупець</th>
                  <th className="px-4 py-3">Ціна</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-[#171717]/50 transition">
                  <td className="px-4 py-3 font-mono">#ORD-1234</td>
                  <td className="px-4 py-3">Discord Nitro 1 Month</td>
                  <td className="px-4 py-3">User123</td>
                  <td className="px-4 py-3 font-medium text-green-400">$4.99</td>
                  <td className="px-4 py-3"><span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs">Виконано</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Users, ShoppingBag, ShieldAlert, Activity } from "@/lib/lucide";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-2">
        <div className="card p-4 space-y-1">
          <div className="text-xs text-red-500 font-bold px-3 mb-2 uppercase">Адміністратор</div>
          <Link href="/admin" className="block px-3 py-2 rounded bg-red-500/10 text-red-400 font-medium">Dashboard</Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Користувачі</Link>
          <Link href="/admin/products" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Товари (Модерація)</Link>
          <Link href="/admin/disputes" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Спори</Link>
          <Link href="/admin/forum" className="block px-3 py-2 rounded hover:bg-[#171717] text-gray-300 transition">Форум</Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 space-y-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Користувачі</div>
              <div className="text-2xl font-bold">12,450</div>
            </div>
            <div className="p-3 bg-[#0a0a0a] rounded-full"><Users className="w-5 h-5 text-blue-400" /></div>
          </div>
          <div className="card p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Товари</div>
              <div className="text-2xl font-bold">4,230</div>
            </div>
            <div className="p-3 bg-[#0a0a0a] rounded-full"><ShoppingBag className="w-5 h-5 text-purple-400" /></div>
          </div>
          <div className="card p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Відкриті спори</div>
              <div className="text-2xl font-bold text-red-400">14</div>
            </div>
            <div className="p-3 bg-[#0a0a0a] rounded-full"><ShieldAlert className="w-5 h-5 text-red-400" /></div>
          </div>
          <div className="card p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Дохід платформи</div>
              <div className="text-2xl font-bold text-green-400">$8,450.00</div>
            </div>
            <div className="p-3 bg-[#0a0a0a] rounded-full"><Activity className="w-5 h-5 text-green-400" /></div>
          </div>
        </div>
        
        {/* Moderation Queue */}
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Очікують модерації (Products)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-[#171717] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Товар</th>
                  <th className="px-4 py-3">Продавець</th>
                  <th className="px-4 py-3">Ціна</th>
                  <th className="px-4 py-3">Дія</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-[#171717]/50 transition">
                  <td className="px-4 py-3 font-medium">Netflix Premium 1 Month</td>
                  <td className="px-4 py-3">NewSeller99</td>
                  <td className="px-4 py-3">$2.50</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded hover:bg-green-500/30">Approve</button>
                    <button className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

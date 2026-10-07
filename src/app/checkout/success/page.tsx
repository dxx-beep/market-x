import Link from "next/link";
import { ShieldCheck } from "@/lib/lucide";

export default function Success() {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="card p-10 relative overflow-hidden">
        <div className="relative">
          <div className="icon-tile w-16 h-16 mx-auto mb-5 !bg-emerald-500/10 !border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Замовлення оформлено</h1>
          <p className="text-gray-400 mb-8">
            Дякуємо за покупку. Цифрові ключі доступні у вашому кабінеті.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard" className="btn-primary">
              Мої замовлення
            </Link>
            <Link href="/catalog" className="btn-ghost">
              Продовжити покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

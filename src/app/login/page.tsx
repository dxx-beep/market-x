import Link from "next/link";
import { loginAction } from "@/app/actions";
import { Discord } from "@/lib/lucide";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="card p-8 relative overflow-hidden">
        <div className="relative">
          <span className="icon-tile w-11 h-11 mb-4 text-lg font-black text-violet-300">X</span>
          <h1 className="text-2xl font-bold mb-1">Авторизація</h1>
          <p className="text-gray-400 text-sm mb-7">Увійдіть у свій акаунт MarketX</p>

          {error && <div className="alert-error mb-4">{error}</div>}

          <form action={loginAction} className="space-y-4">
            <label className="label">
              Email
              <input
                name="email"
                required
                type="email"
                className="field"
                placeholder="mail@example.com"
              />
            </label>
            <label className="label">
              Пароль
              <input
                name="password"
                required
                type="password"
                className="field"
                placeholder="••••••••"
              />
            </label>
            <button className="w-full btn-primary mt-2">Увійти</button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
            <span className="h-px bg-gray-800 flex-1" /> або{" "}
            <span className="h-px bg-gray-800 flex-1" />
          </div>

          <a
            href="/api/auth/discord"
            className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] py-2.5 font-medium transition"
          >
            <Discord className="w-5 h-5" /> Увійти через Discord
          </a>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Немає акаунта?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition">
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

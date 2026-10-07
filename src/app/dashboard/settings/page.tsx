import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateUsernameAction, updateBadgesAction } from "@/app/actions";
import { UserBadge, UserBadges } from "@/components/UserBadge";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; success?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;

  // Fetch all active badges ordered by priority
  const allBadges = await db.badge.findMany({
    where: { isActive: true },
    orderBy: { priority: "desc" },
  });

  const userBadgeKeys = ((user as any).badges || []).map((ub: any) => ub.badge?.key || ub.key);

  const categories = [
    { key: "SYSTEM", title: "Системні бейджі" },
    { key: "ACHIEVEMENT", title: "Досягнення (Achievements)" },
    { key: "COSMETIC", title: "Косметичні бейджі" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Налаштування акаунта</h1>
        <p className="text-gray-500 text-sm mt-1">Керування обліковим записом, бейджами та нікнеймом.</p>
      </div>

      {params?.error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {params.error}
        </div>
      )}

      {params?.success && (
        <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {params.success}
        </div>
      )}

      {/* Animated Badges Showcase & Selector */}
      <div className="card p-6 space-y-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                <span>Бейджі профілю</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {allBadges.length} доступно
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Оберіть бейджі, які будуть відображатися біля вашого імені в системі та на форумі.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#101012] px-3 py-1.5 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400">Попередній перегляд:</span>
              <UserBadges badges={(user as any).badges} role={user.role} max={3} overflow />
            </div>
          </div>
        </div>

        <form action={updateBadgesAction} className="space-y-6">
          {categories.map((cat) => {
            const catBadges = allBadges.filter((b) => (b.category || "COSMETIC") === cat.key);
            if (!catBadges.length) return null;

            return (
              <div key={cat.key} className="space-y-2.5">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {cat.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catBadges.map((badgeItem) => {
                    const isChecked = userBadgeKeys.includes(badgeItem.key);
                    return (
                      <label
                        key={badgeItem.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                          isChecked
                            ? "bg-[#161619] border-gray-600 shadow-sm"
                            : "bg-[#101012] border-gray-800/80 hover:bg-[#161618] hover:border-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="badges"
                          value={badgeItem.key}
                          defaultChecked={isChecked}
                          className="mt-1 w-4 h-4 rounded bg-[#0a0a0a] border-gray-700 text-purple-600 focus:ring-0 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-gray-200">
                              {badgeItem.name}
                            </span>
                            <UserBadge badge={badgeItem} variant="pill" size="sm" />
                          </div>
                          {badgeItem.description && (
                            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">
                              {badgeItem.description}
                            </p>
                          )}
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                            <span>Пріоритет: {badgeItem.priority}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <button type="submit" className="btn-primary text-sm py-2 px-5">
              Зберегти бейджі
            </button>
          </div>
        </form>
      </div>

      {/* Nickname Form */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-200 mb-1">Нікнейм на платформі</h2>
        <p className="text-xs text-gray-400 mb-4">
          Цей нікнейм відображається в кабінеті, на форумі та для продавців/покупців.
        </p>

        <form action={updateUsernameAction} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5 uppercase tracking-wider">
              Ваш нікнейм
            </label>
            <input
              type="text"
              name="username"
              defaultValue={user.username}
              required
              minLength={2}
              maxLength={32}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-2.5 px-3.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition"
              placeholder="Введіть бажаний нік..."
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm py-2 px-5">
              Зберегти нікнейм
            </button>
            <a
              href="/api/auth/discord"
              className="inline-flex items-center gap-2 text-sm py-2 px-4 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white transition font-medium"
            >
              <span>Синхронізувати з Discord</span>
            </a>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="card p-6 space-y-5">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
          <p className="text-base font-medium text-gray-200 mt-1">{user.email}</p>
        </div>
        <div className="border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Роль</p>
          <p className="text-base font-medium text-gray-200 mt-1">
            {user.role === "ADMIN" ? "Адміністратор" : user.role === "SELLER" ? "Продавець" : "Покупець"}
          </p>
        </div>
        {user.avatarUrl && (
          <div className="border-t border-gray-800 pt-4 flex items-center gap-3">
            <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-xs text-gray-500">Аватар</p>
              <p className="text-xs text-green-400">Синхронізовано з Discord</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

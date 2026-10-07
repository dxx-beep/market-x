import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createTopicAction } from "@/app/actions";
import { ArrowLeft, MessageSquarePlus } from "@/lib/lucide";

export default async function CreateTopicPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { error } = await searchParams;

  const categories = await db.forumCategory.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Назад до категорій форуму
        </Link>
        <span className="text-[11px] text-gray-500 uppercase tracking-widest font-mono">
          Нове обговорення
        </span>
      </div>

      <div className="rounded-2xl border border-[#222226] bg-[#0c0c0e] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-[#1c1c20] pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#161619] border border-[#26262c] text-gray-300">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-100">
                Створити нову тему
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Опишіть ваше питання або пропозицію для спільноти MarketX
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form action={createTopicAction} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Розділ форуму
            </label>
            <select
              name="categoryId"
              required
              defaultValue={categories[0]?.id || ""}
              className="w-full bg-[#141417] border border-[#28282e] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-gray-500 transition"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#141417] text-gray-200">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Заголовок теми
            </label>
            <input
              name="title"
              required
              minLength={4}
              maxLength={120}
              placeholder="Коротко та зрозуміло сформулюйте суть..."
              className="w-full bg-[#141417] border border-[#28282e] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Повідомлення
            </label>
            <textarea
              name="content"
              required
              rows={8}
              minLength={10}
              placeholder="Детально опишіть ситуацію, додайте деталі або умови..."
              className="w-full bg-[#141417] border border-[#28282e] rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition resize-y"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1c1c20]">
            <span className="text-[11px] text-gray-500">
              Публікується від імені <strong className="text-gray-300">@{user.username}</strong>
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/forum"
                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition"
              >
                Скасувати
              </Link>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-white text-black font-semibold text-xs tracking-wide transition shadow"
              >
                Опублікувати тему
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, MessageSquare, ChevronRight, Hash, Clock } from "@/lib/lucide";
import { UserBadges } from "@/components/UserBadge";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await db.forumCategory.findUnique({
    where: { id },
    include: {
      topics: {
        include: {
          author: {
            include: {
              badges: {
                include: { badge: true },
                orderBy: { badge: { priority: "desc" } },
              },
            },
          },
          posts: { take: 1, orderBy: { createdAt: "desc" } },
        },
        orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Всі розділи форуму
        </Link>
        <Link
          href="/forum/create"
          className="px-3.5 py-1.5 rounded-lg bg-[#222226] hover:bg-[#2c2c32] border border-[#33333a] text-gray-200 text-xs font-medium transition"
        >
          + Створити тему в цьому розділі
        </Link>
      </div>

      <div className="p-6 rounded-2xl border border-[#202024] bg-[#0c0c0e] space-y-2">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-gray-400" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-100">
            {category.name}
          </h1>
        </div>
        {category.description && (
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-[#202024] bg-[#0f0f11] divide-y divide-[#1b1b1e] overflow-hidden">
        {category.topics.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <MessageSquare className="w-8 h-8 mx-auto text-gray-600" />
            <p className="text-sm">У цьому розділі ще немає тем.</p>
            <Link
              href="/forum/create"
              className="inline-block text-xs text-gray-300 underline underline-offset-4 hover:text-white"
            >
              Будьте першим, хто створить тему →
            </Link>
          </div>
        ) : (
          category.topics.map((topic) => (
            <div
              key={topic.id}
              className="p-5 flex items-center justify-between gap-4 hover:bg-[#141417] transition"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  {topic.isPinned && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#222226] text-gray-300 border border-[#333338]">
                      Закріплено
                    </span>
                  )}
                  <Link
                    href={`/forum/topic/${topic.id}`}
                    className="text-base font-semibold text-gray-100 hover:text-white transition truncate block"
                  >
                    {topic.title}
                  </Link>
                </div>
                <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    Автор: <strong className="text-gray-300">@{topic.author.username}</strong>
                  </span>
                  <UserBadges
                    badges={(topic.author as any).badges}
                    role={topic.author.role}
                    max={2}
                    overflow
                    variant="icon"
                    size="sm"
                  />
                  <span>•</span>
                  <span>{new Date(topic.createdAt).toLocaleDateString("uk-UA")}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs shrink-0">
                <div className="text-right">
                  <div className="font-semibold text-gray-200">{topic.posts.length}</div>
                  <div className="text-gray-500 text-[11px]">Відповідей</div>
                </div>
                <Link
                  href={`/forum/topic/${topic.id}`}
                  className="w-8 h-8 rounded-lg bg-[#18181b] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#222226] transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

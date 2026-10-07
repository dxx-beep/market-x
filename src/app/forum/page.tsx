import Link from "next/link";
import { db } from "@/lib/db";
import { MessageSquare, Users, ShieldAlert, ShoppingBag, Hash, ChevronRight } from "@/lib/lucide";
import { UserBadges } from "@/components/UserBadge";

export default async function ForumPage() {
  const categories = await db.forumCategory.findMany({
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
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { position: "asc" },
  });

  const sections = [
    {
      key: "MARKETPLACE",
      title: "Торгівля та ринок",
      icon: <ShoppingBag className="w-4 h-4 text-gray-300" />,
      items: categories.filter((c) => c.section === "MARKETPLACE"),
    },
    {
      key: "COMMUNITY",
      title: "Спільнота та технології",
      icon: <Users className="w-4 h-4 text-gray-300" />,
      items: categories.filter((c) => c.section === "COMMUNITY"),
    },
    {
      key: "SUPPORT",
      title: "Підтримка та пропозиції",
      icon: <ShieldAlert className="w-4 h-4 text-gray-300" />,
      items: categories.filter((c) => c.section === "SUPPORT"),
    },
  ];

  const totalTopics = categories.reduce((sum, c) => sum + c.topics.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202024] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
            Спільнота MarketX
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">Форум</h1>
          <p className="text-sm text-gray-400 mt-1">
            Обговорення товарів, взаємодопомога, новини та безпечні угоди.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/forum/create"
            className="px-4 py-2 rounded-lg bg-[#222226] hover:bg-[#2c2c32] border border-[#33333a] text-gray-200 text-sm font-medium transition shadow-sm"
          >
            + Створити тему
          </Link>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-8">
        {sections.map((section) => {
          if (!section.items.length) return null;

          return (
            <div key={section.key} className="space-y-3">
              <div className="flex items-center gap-2.5 px-1">
                <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a]">
                  {section.icon}
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  {section.title}
                </h2>
              </div>

              <div className="rounded-xl border border-[#202024] bg-[#0f0f11] divide-y divide-[#1b1b1e] overflow-hidden shadow-sm">
                {section.items.map((cat) => {
                  const topicCount = cat.topics.length;
                  const postCount = cat.topics.reduce((acc, t) => acc + (t.posts.length || 0), 0);
                  const latestTopic = cat.topics[0];

                  return (
                    <div
                      key={cat.id}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#141417] transition duration-150"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="mt-1 p-2 rounded-lg bg-[#18181b] border border-[#26262b] text-gray-400 shrink-0">
                          <Hash className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/forum/category/${cat.id}`}
                            className="text-base font-semibold text-gray-100 hover:text-white transition inline-flex items-center gap-1.5 group"
                          >
                            <span>{cat.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-0.5 transition" />
                          </Link>
                          {cat.description && (
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs shrink-0 self-end md:self-center">
                        <div className="text-right">
                          <div className="font-semibold text-gray-200">{topicCount}</div>
                          <div className="text-gray-500 text-[11px]">Тем</div>
                        </div>

                        <div className="text-right border-l border-[#202024] pl-6">
                          <div className="font-semibold text-gray-200">{postCount}</div>
                          <div className="text-gray-500 text-[11px]">Повідомлень</div>
                        </div>

                        {latestTopic && (
                          <div className="hidden lg:block border-l border-[#202024] pl-6 text-right w-44">
                            <Link
                              href={`/forum/topic/${latestTopic.id}`}
                              className="font-medium text-gray-300 hover:text-white truncate block text-xs"
                            >
                              {latestTopic.title}
                            </Link>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                              <span className="text-[11px] text-gray-500 truncate">
                                {latestTopic.author.username}
                              </span>
                              <UserBadges
                                badges={(latestTopic.author as any).badges}
                                role={latestTopic.author.role}
                                max={2}
                                overflow
                                variant="icon"
                                size="sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Forum Stats Footer */}
      <div className="p-4 rounded-xl border border-[#202024] bg-[#0c0c0e] flex flex-wrap items-center justify-between text-xs text-gray-400 gap-4">
        <div className="flex items-center gap-4">
          <span>Всього тем: <strong className="text-gray-200">{totalTopics}</strong></span>
          <span>•</span>
          <span>Модерація: <strong className="text-emerald-400">Цілодобова</strong></span>
        </div>
        <div className="text-gray-500 text-[11px]">
          Дотримуйтесь правил спільноти при створенні тем та публікації відповідей.
        </div>
      </div>
    </div>
  );
}

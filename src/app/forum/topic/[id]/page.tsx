import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { replyTopicAction } from "@/app/actions";
import { ArrowLeft, Clock, MessageSquare, ShieldCheck, User as UserIcon } from "@/lib/lucide";
import { UserBadges } from "@/components/UserBadge";

export default async function TopicDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const user = await getCurrentUser();

  const topic = await db.forumTopic.findUnique({
    where: { id },
    include: {
      category: true,
      author: {
        include: {
          badges: {
            include: { badge: true },
            orderBy: { badge: { priority: "desc" } },
          },
        },
      },
      posts: {
        include: {
          author: {
            include: {
              badges: {
                include: { badge: true },
                orderBy: { badge: { priority: "desc" } },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!topic) notFound();

  // Increment views quietly
  await db.forumTopic.update({
    where: { id },
    data: { views: { increment: 1 } },
  }).catch(() => null);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Back button and breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Всі розділи форуму
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span>{topic.category.name}</span>
          <span>•</span>
          <span className="text-gray-400">{topic.views + 1} переглядів</span>
        </div>
      </div>

      {/* Topic Title Card */}
      <div className="p-6 sm:p-7 rounded-2xl border border-[#222226] bg-[#0c0c0e] space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#18181c] border border-[#2b2b32] text-gray-300">
            {topic.category.name}
          </span>
          {topic.isPinned && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#242428] text-white border border-gray-600">
              Закріплено
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center gap-1.5 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {new Date(topic.createdAt).toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-100">
          {topic.title}
        </h1>
      </div>

      {/* Posts thread */}
      <div className="space-y-4">
        {topic.posts.map((post, idx) => {
          const isOP = post.authorId === topic.authorId;
          const isAdmin = post.author.role === "ADMIN";
          const isSeller = post.author.role === "SELLER";

          return (
            <div
              key={post.id}
              className={`rounded-2xl border transition duration-150 overflow-hidden ${
                idx === 0
                  ? "border-[#27272d] bg-[#0e0e11]"
                  : "border-[#1e1e22] bg-[#0b0b0d]"
              }`}
            >
              {/* Post Header */}
              <div className="px-6 py-3.5 bg-[#121215]/60 border-b border-[#1b1b1f] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1e22] border border-[#2e2e34] flex items-center justify-center text-gray-300 overflow-hidden shrink-0">
                    {post.author.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-200">
                      {post.author.username}
                    </span>
                    <UserBadges
                      badges={(post.author as any).badges}
                      role={post.author.role}
                      max={3}
                      overflow
                      variant="pill"
                      size="sm"
                    />
                    {isOP && (
                      <span className="px-1.5 py-0.5 rounded bg-[#1a1a1e] text-gray-400 border border-[#26262b] text-[10px] font-mono">
                        Автор
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 font-mono">
                  #{idx + 1} • {new Date(post.createdAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                {post.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Section */}
      <div className="rounded-2xl border border-[#222226] bg-[#0c0c0e] p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          Відповісти в темі
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        {user ? (
          <form action={replyTopicAction} className="space-y-4">
            <input type="hidden" name="topicId" value={topic.id} />
            <textarea
              name="content"
              required
              rows={4}
              placeholder="Напишіть вашу відповідь по темі..."
              className="w-full bg-[#141417] border border-[#28282e] rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition resize-y"
            ></textarea>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                Ви відповідаєте як <strong className="text-gray-300">@{user.username}</strong>
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-white text-black font-semibold text-xs tracking-wide transition shadow"
              >
                Надіслати відповідь
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-xl bg-[#141417] border border-[#222226] text-center space-y-3">
            <p className="text-xs text-gray-400">
              Щоб залишати відповіді у темах форуму, будь ласка, увійдіть у свій акаунт.
            </p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 rounded-xl bg-gray-200 hover:bg-white text-black text-xs font-semibold transition"
            >
              Увійти в акаунт
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

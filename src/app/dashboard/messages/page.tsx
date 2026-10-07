import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardMessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const messages = await db.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Повідомлення</h1>
        <p className="text-gray-500 text-sm mt-1">Ваші діалоги з продавцями та покупцями.</p>
      </div>

      {messages.length ? (
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="card p-5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-200">
                  {message.senderId === user.id ? `Ти → ${message.receiver.username}` : message.sender.username}
                </span>
                <span className="text-gray-500 text-xs">
                  {message.createdAt.toLocaleDateString("uk-UA")}
                </span>
              </div>
              <p className="text-gray-400 mt-2 text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-gray-500">
          Повідомлень ще немає.
        </div>
      )}
    </div>
  );
}

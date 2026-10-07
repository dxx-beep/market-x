import { db } from "../src/lib/db";

async function main() {
  const user = await db.user.findFirst({
    where: { email: "kukannngggg@protonmail.com" },
  });

  if (!user) {
    console.log("Користувача не знайдено");
    return;
  }

  // Delete relations
  await db.session.deleteMany({ where: { userId: user.id } });
  await db.cartItem.deleteMany({ where: { userId: user.id } });
  await db.favorite.deleteMany({ where: { userId: user.id } });
  await db.walletTransaction.deleteMany({ where: { userId: user.id } });
  await db.orderItem.deleteMany({
    where: { order: { buyerId: user.id } },
  });
  await db.order.deleteMany({ where: { buyerId: user.id } });
  await db.message.deleteMany({
    where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
  });
  await db.review.deleteMany({ where: { authorId: user.id } });
  await db.forumPost.deleteMany({ where: { authorId: user.id } });
  await db.forumTopic.deleteMany({ where: { authorId: user.id } });

  await db.user.delete({ where: { id: user.id } });
  console.log(`Акаунт ${user.email} (${user.username}) успішно видалено з бази.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

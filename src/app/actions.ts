"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, hashPassword, requireUser, verifyPassword } from "@/lib/auth";

export async function registerAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const repeat = String(formData.get("repeat") || "");
  if (username.length < 3 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password !== repeat) redirect("/register?error=Перевірте%20дані%20форми");
  const exists = await db.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (exists) redirect("/register?error=Користувач%20вже%20існує");
  const user = await db.user.create({ data: { username, email, passwordHash: hashPassword(password) } });
  await createSession(user.id);
  redirect("/onboarding");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) redirect("/login?error=Невірний%20email%20або%20пароль");
  await createSession(user.id);
  redirect("/onboarding");
}

export async function logoutAction() { await destroySession(); redirect("/"); }

export async function chooseRoleAction(formData: FormData) {
  const user = await requireUser();
  const role = String(formData.get("role")) === "SELLER" ? "SELLER" : "USER";
  await db.user.update({ where: { id: user.id }, data: { role, onboardingDone: true, ...(role === "SELLER" ? { sellerProfile: { create: { bio: "Новий продавець MarketX" } } } : {}) } });
  redirect(role === "SELLER" ? "/seller" : "/dashboard");
}

export async function selectRoleAction(role: "USER" | "SELLER") {
  const user = await requireUser();
  const chosen = role === "SELLER" ? "SELLER" : "USER";
  await db.user.update({
    where: { id: user.id },
    data: {
      role: chosen,
      onboardingDone: true,
      ...(chosen === "SELLER"
        ? {
            sellerProfile: {
              upsert: {
                create: { bio: "Новий продавець MarketX" },
                update: {},
              },
            },
          }
        : {}),
    },
  });
  redirect(chosen === "SELLER" ? "/seller" : "/dashboard");
}

export async function addToCartAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId"));
  await db.cartItem.upsert({ where: { userId_productId: { userId: user.id, productId } }, update: { quantity: { increment: 1 } }, create: { userId: user.id, productId } });
  revalidatePath("/cart");
}

export async function removeFromCartAction(formData: FormData) {
  const user = await requireUser();
  await db.cartItem.deleteMany({ where: { userId: user.id, productId: String(formData.get("productId")) } });
  revalidatePath("/cart");
}

export async function toggleFavoriteAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId"));
  const existing = await db.favorite.findUnique({ where: { userId_productId: { userId: user.id, productId } } });
  if (existing) await db.favorite.delete({ where: { id: existing.id } });
  else await db.favorite.create({ data: { userId: user.id, productId } });
  revalidatePath("/favorites");
  revalidatePath("/dashboard/favorites");
  revalidatePath(`/product/${productId}`);
}

export async function checkoutAction() {
  const user = await requireUser();
  const cart = await db.cartItem.findMany({ where: { userId: user.id }, include: { product: true } });
  if (!cart.length) redirect("/cart?error=Кошик%20порожній");
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  if (user.balance < total) redirect("/cart?error=Недостатньо%20коштів");
  const sellerId = cart[0].product.sellerId;
  const order = await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { balance: { decrement: total } } });
    await tx.walletTransaction.create({ data: { userId: user.id, type: "PURCHASE", amount: -total } });
    const created = await tx.order.create({ data: { buyerId: user.id, sellerId, totalAmount: total, status: "COMPLETED", items: { create: cart.map((item) => ({ productId: item.productId, quantity: item.quantity, price: item.product.price })) } } });
    for (const item of cart) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      await tx.digitalKey.updateMany({ where: { productId: item.productId, isUsed: false }, data: { isUsed: true, orderId: created.id } });
    }
    await tx.cartItem.deleteMany({ where: { userId: user.id } });
    return created;
  });
  redirect(`/checkout/success?id=${order.id}`);
}

export async function updateUsernameAction(formData: FormData) {
  const user = await requireUser();
  const username = String(formData.get("username") || "").trim();
  if (username.length < 2 || username.length > 32) {
    redirect("/dashboard/settings?error=Нікнейм%20має%20бути%20від%202%20до%2032%20символів");
  }
  const existing = await db.user.findFirst({
    where: { username, NOT: { id: user.id } }
  });
  if (existing) {
    redirect("/dashboard/settings?error=Цей%20нікнейм%20вже%20зайнятий");
  }
  await db.user.update({
    where: { id: user.id },
    data: { username }
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?success=Нікнейм%20успішно%20оновлено");
}

export async function createTopicAction(formData: FormData) {
  const user = await requireUser();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!categoryId || title.length < 4 || content.length < 10) {
    redirect("/forum/create?error=Заповніть%20всі%20поля%20(заголовок%20від%204%20символів,%20текст%20від%2010)");
  }

  const topic = await db.forumTopic.create({
    data: {
      categoryId,
      authorId: user.id,
      title,
      content,
      posts: {
        create: {
          authorId: user.id,
          content,
        },
      },
    },
  });

  revalidatePath("/forum");
  redirect(`/forum/topic/${topic.id}`);
}

export async function replyTopicAction(formData: FormData) {
  const user = await requireUser();
  const topicId = String(formData.get("topicId") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!topicId || content.length < 3) {
    redirect(`/forum/topic/${topicId}?error=Повідомлення%20занадто%20коротке`);
  }

  await db.forumPost.create({
    data: {
      topicId,
      authorId: user.id,
      content,
    },
  });

  await db.forumTopic.update({
    where: { id: topicId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/forum/topic/${topicId}`);
  revalidatePath("/forum");
  redirect(`/forum/topic/${topicId}`);
}

export async function updateBadgesAction(formData: FormData) {
  const user = await requireUser();
  const selectedKeys = formData.getAll("badges").map(String);

  const validBadges = await db.badge.findMany({
    where: { key: { in: selectedKeys }, isActive: true },
  });

  await db.$transaction(async (tx) => {
    await tx.userBadge.deleteMany({ where: { userId: user.id } });
    if (validBadges.length > 0) {
      await tx.userBadge.createMany({
        data: validBadges.map((b) => ({
          userId: user.id,
          badgeId: b.id,
        })),
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/forum");
  redirect("/dashboard/settings?success=Бейджі%20успішно%20оновлено");
}


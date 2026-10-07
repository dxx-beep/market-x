import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding MarketX database...')

  // Check or create demo admin
  let admin = await prisma.user.findUnique({ where: { email: 'admin@marketx.com' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        username: 'Admin_MarketX',
        email: 'admin@marketx.com',
        passwordHash: 'dummyhash',
        role: 'ADMIN',
        balance: 5000,
        reputation: 999,
        onboardingDone: true,
      }
    });
  }

  // Check or create demo sellers
  let sellerUser1 = await prisma.user.findUnique({ where: { email: 'trusted@marketx.com' } });
  if (!sellerUser1) {
    sellerUser1 = await prisma.user.create({
      data: {
        username: 'TrustedSellerUA',
        email: 'trusted@marketx.com',
        passwordHash: 'dummyhash',
        role: 'SELLER',
        balance: 1450,
        reputation: 240,
        onboardingDone: true,
      }
    });
  }

  let sellerProfile1 = await prisma.sellerProfile.findUnique({ where: { userId: sellerUser1.id } });
  if (!sellerProfile1) {
    sellerProfile1 = await prisma.sellerProfile.create({
      data: {
        userId: sellerUser1.id,
        totalSales: 1240,
        rating: 4.95,
        bio: 'Офіційний реселлер цифрових підписок Discord, Telegram та AI. Швидка та безпечна видача.',
      }
    });
  }

  let sellerUser2 = await prisma.user.findUnique({ where: { email: 'gameshop@marketx.com' } });
  if (!sellerUser2) {
    sellerUser2 = await prisma.user.create({
      data: {
        username: 'SteamMaster',
        email: 'gameshop@marketx.com',
        passwordHash: 'dummyhash',
        role: 'SELLER',
        balance: 890,
        reputation: 180,
        onboardingDone: true,
      }
    });
  }

  let sellerProfile2 = await prisma.sellerProfile.findUnique({ where: { userId: sellerUser2.id } });
  if (!sellerProfile2) {
    sellerProfile2 = await prisma.sellerProfile.create({
      data: {
        userId: sellerUser2.id,
        totalSales: 630,
        rating: 4.88,
        bio: 'Ігрові ключі, подарункові картки Steam, Xbox та PlayStation за вигідними цінами.',
      }
    });
  }

  // Categories and Subcategories
  const categoriesData = [
    { name: 'Discord', slug: 'discord', description: 'Підписки Discord Nitro, Boost серверів' },
    { name: 'Telegram', slug: 'telegram', description: 'Telegram Premium, Stars, боти та канали' },
    { name: 'AI', slug: 'ai', description: 'Підписки ChatGPT Plus, Claude, Midjourney та API ключі' },
    { name: 'Games', slug: 'games', description: 'Ключі Steam, Epic Games, PlayStation та ігрова валюта' },
    { name: 'Social Media', slug: 'social-media', description: 'Послуги, акаунти та оформлення соцмереж' },
    { name: 'Gift Cards', slug: 'gift-cards', description: 'Подарункові картки Steam, Apple, Google Play' },
    { name: 'Software', slug: 'software', description: 'Ліцензійні ключі Windows, Office, VPN та антивіруси' },
  ];

  const categoriesMap = new Map();
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: { name: c.name, slug: c.slug, description: c.description },
    });
    categoriesMap.set(c.slug, cat);
  }

  // Subcategories
  const discordCat = categoriesMap.get('discord')!;
  const catNitro = await prisma.category.upsert({
    where: { slug: 'discord-nitro' },
    update: { parentId: discordCat.id },
    create: { name: 'Discord Nitro', slug: 'discord-nitro', parentId: discordCat.id },
  });

  const catBoost = await prisma.category.upsert({
    where: { slug: 'discord-boost' },
    update: { parentId: discordCat.id },
    create: { name: 'Server Boost', slug: 'discord-boost', parentId: discordCat.id },
  });

  const tgCat = categoriesMap.get('telegram')!;
  const catTgPremium = await prisma.category.upsert({
    where: { slug: 'telegram-premium' },
    update: { parentId: tgCat.id },
    create: { name: 'Telegram Premium', slug: 'telegram-premium', parentId: tgCat.id },
  });

  const aiCat = categoriesMap.get('ai')!;
  const gamesCat = categoriesMap.get('games')!;
  const giftCat = categoriesMap.get('gift-cards')!;
  const softCat = categoriesMap.get('software')!;

  // Products
  const products = [
    {
      sellerId: sellerProfile1.id,
      categoryId: catNitro.id,
      title: 'Discord Nitro 1 Month (Full Gift Link)',
      slug: 'discord-nitro-1-month',
      description: 'Офіційне посилання на подарунок Discord Nitro на 1 місяць. Миттєва видача одразу після оплати.',
      price: 4.99,
      discount: 0,
      stock: 50,
      type: 'AUTOMATIC',
      keys: ['GIFT-NITRO-1M-AA89F', 'GIFT-NITRO-1M-BB72K', 'GIFT-NITRO-1M-CC41P'],
    },
    {
      sellerId: sellerProfile1.id,
      categoryId: catNitro.id,
      title: 'Discord Nitro 1 Year (Річна підписка)',
      slug: 'discord-nitro-1-year',
      description: 'Річна підписка Discord Nitro. Економія понад 40%. Гарантія на весь термін дії підписки.',
      price: 49.99,
      discount: 10,
      stock: 20,
      type: 'AUTOMATIC',
      keys: ['GIFT-NITRO-1Y-X889K', 'GIFT-NITRO-1Y-Z712M'],
    },
    {
      sellerId: sellerProfile1.id,
      categoryId: catBoost.id,
      title: 'Discord Server Boost x14 (Level 3 на 1 місяць)',
      slug: 'discord-server-boost-14',
      description: '14 бустів на ваш сервер Discord для миттєвого отримання 3-го рівня. Виконання протягом 15 хвилин.',
      price: 9.99,
      discount: 0,
      stock: 15,
      type: 'MANUAL',
      keys: [],
    },
    {
      sellerId: sellerProfile1.id,
      categoryId: catTgPremium.id,
      title: 'Telegram Premium 3 Місяці (Подарунок без входу)',
      slug: 'telegram-premium-3-months',
      description: 'Активація підписки Telegram Premium на 3 місяці. Вхід у ваш акаунт не потрібен, лише юзернейм.',
      price: 11.50,
      discount: 5,
      stock: 40,
      type: 'AUTOMATIC',
      keys: ['TG-PREM-3M-Q8182', 'TG-PREM-3M-W9910'],
    },
    {
      sellerId: sellerProfile1.id,
      categoryId: aiCat.id,
      title: 'ChatGPT Plus (GPT-4o) 1 Місяць Підписка',
      slug: 'chatgpt-plus-1-month',
      description: 'Доступ до ChatGPT Plus на 30 днів. Персональний акаунт або активація на вашу пошту.',
      price: 19.99,
      discount: 0,
      stock: 25,
      type: 'MANUAL',
      keys: [],
    },
    {
      sellerId: sellerProfile2.id,
      categoryId: gamesCat.id,
      title: 'Steam Gift Card $20 USD (Global)',
      slug: 'steam-gift-card-20',
      description: 'Глобальний цифровий код поповнення гаманця Steam на $20. Без регіональних обмежень.',
      price: 21.00,
      discount: 0,
      stock: 30,
      type: 'AUTOMATIC',
      keys: ['STEAM-20USD-KK992-MM331', 'STEAM-20USD-LL118-PP774'],
    },
    {
      sellerId: sellerProfile2.id,
      categoryId: softCat.id,
      title: 'Windows 11 Pro Retail Ліцензійний Ключ',
      slug: 'windows-11-pro-license',
      description: 'Оригінальний OEM/Retail ключ активації Windows 11 Pro з безстроковою дією та підтримкою оновлень.',
      price: 8.50,
      discount: 15,
      stock: 100,
      type: 'AUTOMATIC',
      keys: ['WIN11-PRO-VK7JG-NPHTM-C97JM', 'WIN11-PRO-NW6C2-QMPVW-D7KKK'],
    },
  ];

  for (const p of products) {
    const { keys, ...productData } = p;
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      const createdProd = await prisma.product.create({
        data: productData,
      });

      // Digital keys for instant delivery
      for (const k of keys) {
        await prisma.digitalKey.create({
          data: {
            productId: createdProd.id,
            key: k,
            isUsed: false,
          }
        });
      }
    }
  }

  // Forum Categories
  const forumCats = [
    { name: 'Покупки та продажі', section: 'MARKETPLACE', description: 'Обговорення товарів, продавців, безпечних угод та відгуків' },
    { name: 'Пошук товару / продавця', section: 'MARKETPLACE', description: 'Шукаєте рідкісний софт або послугу? Створіть запит тут' },
    { name: 'Загальне спілкування', section: 'COMMUNITY', description: 'Обговорення тем повсякдення, технологій та цифрового світу' },
    { name: 'Ігри та Розваги', section: 'COMMUNITY', description: 'Steam, консолі, модифікації, Discord сервери та новинки' },
    { name: 'Допомога та Підтримка', section: 'SUPPORT', description: 'Питання до адміністрації, вирішення суперечок та допомога новачкам' },
    { name: 'Пропозиції та Баги', section: 'SUPPORT', description: 'Повідомляйте про помилки або пропонуйте нові функції платформи' },
  ];

  for (const fc of forumCats) {
    const existingFc = await prisma.forumCategory.findFirst({ where: { name: fc.name } });
    if (!existingFc) {
      const created = await prisma.forumCategory.create({ data: fc });

      if (fc.name === 'Покупки та продажі') {
        const topic = await prisma.forumTopic.create({
          data: {
            categoryId: created.id,
            authorId: sellerUser1.id,
            title: 'Правила безпечних угод та автоматичної видачі ключів',
            content: 'Вітаємо на MarketX! Завжди перевіряйте статус продавця та використовуйте вбудований баланс платформи для захисту коштів.',
            isPinned: true,
            views: 420,
          }
        });

        await prisma.forumPost.create({
          data: {
            topicId: topic.id,
            authorId: admin.id,
            content: 'Платформа автоматично заморожує кошти до моменту підтвердження отримання цифрового товару покупцем.',
            isSolution: true,
          }
        });
      }
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

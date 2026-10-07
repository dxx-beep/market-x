import { db } from "../src/lib/db";

async function main() {
  const mapping: Record<string, string> = {
    "discord-nitro-1-month": "/images/discord-nitro.png",
    "discord-nitro-1-year": "/images/discord-nitro.png",
    "discord-server-boost-14": "/images/discord-boosts.png",
    "telegram-premium-3-months": "/images/telegram-premium.png",
    "steam-gift-card-20": "/images/steam-cards.png",
  };

  for (const [slug, url] of Object.entries(mapping)) {
    const prod = await db.product.findUnique({ where: { slug } });
    if (prod) {
      await db.productImage.deleteMany({ where: { productId: prod.id } });
      await db.productImage.create({
        data: {
          productId: prod.id,
          url,
        },
      });
      console.log(`Linked image for ${slug} -> ${url}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

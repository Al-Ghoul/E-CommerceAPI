import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto("category")
    .values({
      name: "Electronics",
      description: "Gadgets and devices for every need.",
      icon: "laptop",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      name: "Clothing",
      description: "Fashionable apparel for all seasons.",
      icon: "shirt",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      name: "Home & Garden",
      description: "Decor and tools for your living space.",
      icon: "house-plus",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      name: "Books",
      description: "Bestsellers and niche titles.",
      icon: "book-open",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      name: "Sports & Outdoors",
      description: "Gear for athletes and adventurers.",
      icon: "volleyball",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      name: "Beauty & Personal Care",
      description: "Cosmetics and self-care essentials.",
      icon: "venetian-mask",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      name: "Toys & Games",
      description: "Fun for all ages.",
      icon: "gamepad-2",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      name: "Automotive",
      description: "Parts and accessories for vehicles.",
      icon: "car",
    })
    .execute();
}

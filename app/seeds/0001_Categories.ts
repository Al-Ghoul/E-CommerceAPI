import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto("category")
    .values([
      {
        name: "Electronics",
        description: "Gadgets and devices for every need.",
        icon: "laptop",
      },
      {
        name: "Clothing",
        description: "Fashionable apparel for all seasons.",
        icon: "shirt",
      },
      {
        name: "Home & Garden",
        description: "Decor and tools for your living space.",
        icon: "house-plus",
      },
      {
        name: "Books",
        description: "Bestsellers and niche titles.",
        icon: "book-open",
      },
      {
        name: "Sports & Outdoors",
        description: "Gear for athletes and adventurers.",
        icon: "volleyball",
      },
      {
        name: "Beauty & Personal Care",
        description: "Cosmetics and self-care essentials.",
        icon: "venetian-mask",
      },
      {
        name: "Toys & Games",
        description: "Fun for all ages.",
        icon: "gamepad-2",
      },
      {
        name: "Automotive",
        description: "Parts and accessories for vehicles.",
        icon: "car",
      },
    ])
    .execute();
}

import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto("product")
    .values({
      name: "T-Shirt",
      description: "T-Shirt",
      price: 19.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Jeans",
      description: "Jeans",
      price: 49.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Shirt",
      description: "Shirt",
      price: 29.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Socks",
      description: "Socks",
      price: 9.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Cap",
      description: "Cap",
      price: 9.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Tie",
      description: "Tie",
      price: 9.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Gloves",
      description: "Gloves",
      price: 9.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Sunglasses",
      description: "Sunglasses",
      price: 9.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();

  await db
    .insertInto("product")
    .values({
      name: "Sneakers",
      description: "Sneakers",
      price: 9.99,
      stock_quantity: 100,
      category_id: 1,
    })
    .execute();
}

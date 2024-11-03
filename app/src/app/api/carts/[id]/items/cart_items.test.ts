import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";
import { CreateUserAndGetToken } from "@/testUtils";

afterEach(async () => {
  await db.deleteFrom("user").execute();
  await db.deleteFrom("account").execute();
  await db.deleteFrom("cart").execute();
  await db.deleteFrom("product").execute();
  await db.deleteFrom("category").execute();
});

it("POST returns 201", async () => {
  const { user, access_token } = await CreateUserAndGetToken();
  const createdCart = await db
    .insertInto("cart")
    .values({
      user_id: user.id,
      status: "active",
    })
    .returningAll()
    .executeTakeFirst();
  if (!createdCart) throw new Error("Cart not created");

  const createdCategory = await db
    .insertInto("category")
    .values({ name: "Clothing-test", description: "Clothing", icon: "clothing" })
    .returning("id")
    .executeTakeFirst();

  if (!createdCategory) throw new Error("Category not created");

  const createdSubCategory = await db
    .insertInto("subcategory")
    .values({
      name: "T-Shirts-test",
      description: "T-Shirts",
      category_id: createdCategory.id,
    })
    .returning("id")
    .executeTakeFirst();

  if (!createdSubCategory) throw new Error("SubCategory not created");

  const createdProduct = await db
    .insertInto("product")
    .values({
      name: "T-Shirt-test",
      description: "T-Shirt",
      price: 19.99,
      stock_quantity: 100,
      subcategory_id: createdSubCategory.id,
    })
    .returning("id")
    .executeTakeFirst();

  if (!createdProduct) throw new Error("Product not created");

  await testApiHandler({
    appHandler,
    params: {
      id: createdCart.id,
    },
    test: async ({ fetch }) => {
      const data = {
        product_id: createdProduct.id,
        quantity: 5,
      };
      const response = await fetch({
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const json = await response.json();
      expect(response.status).toBe(201);
      expect(json).toMatchObject({
        data: {
          product_id: expect.any(String),
          quantity: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        status: "success",
        message: "Cart item was created successfully!",
        statusCode: 201,
      });
    },
  });
});

it("GET returns 200", async () => {
  const { user, access_token } = await CreateUserAndGetToken();
  const createdCart = await db
    .insertInto("cart")
    .values({
      user_id: user.id,
      status: "active",
    })
    .returningAll()
    .executeTakeFirst();
  if (!createdCart) throw new Error("Cart not created");

  const createdCategory = await db
    .insertInto("category")
    .values({ name: "Clothing", description: "Clothing", icon: "clothing" })
    .returning("id")
    .executeTakeFirst();

  if (!createdCategory) throw new Error("Category not created");

  const createdSubCategory = await db
    .insertInto("subcategory")
    .values({
      name: "T-Shirts",
      description: "T-Shirts",
      category_id: createdCategory.id,
    })
    .returning("id")
    .executeTakeFirst();

  if (!createdSubCategory) throw new Error("SubCategory not created");

  const createdProduct = await db
    .insertInto("product")
    .values({
      name: "T-Shirt",
      description: "T-Shirt",
      price: 19.99,
      stock_quantity: 100,
      subcategory_id: createdSubCategory.id,
    })
    .returning("id")
    .executeTakeFirst();

  if (!createdProduct) throw new Error("Product not created");

  const createdCartItem = await db
    .insertInto("cart_item")
    .values({
      cart_id: createdCart.id,
      product_id: createdProduct.id,
      quantity: 5,
    })
    .returningAll()
    .execute();

  await testApiHandler({
    appHandler,
    params: {
      id: createdCart.id,
    },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data: createdCartItem.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })),
        status: "success",
        message: "Cart items were retrieved successfully!",
        statusCode: 200,
      });
    },
  });
});

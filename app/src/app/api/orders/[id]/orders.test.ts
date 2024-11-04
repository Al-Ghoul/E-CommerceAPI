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
  await db.deleteFrom("order").execute();
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
    .values({ name: "Clothing-test", description: "Clothing", icon: "clothing" })
    .returning("id")
    .executeTakeFirst();

  if (!createdCategory) throw new Error("Category not created");

  const createdSubCategory = await db
    .insertInto("subcategory")
    .values({
      name: "T-Shirt",
      description: "T-Shirt",
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
    .returning(["id", "price"])
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
    .executeTakeFirst();

  if (!createdCartItem) throw new Error("Cart item not created");

  const createdOrder = await db
    .insertInto("order")
    .values({
      total_amount:
        Number(createdProduct.price) * parseInt(createdCartItem.quantity),
      user_id: user.id,
      cart_id: createdCart.id,
      fulfillment_status: "pending",
    })
    .returningAll()
    .executeTakeFirst();

  if (!createdOrder) throw new Error("Order not created");

  await testApiHandler({
    appHandler,
    params: {
      id: createdOrder.id,
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
        data: {
          id: expect.any(String),
          user_id: user.id,
          fulfillment_status: "pending",
          cart_id: createdCart.id,
          total_amount: (99.94999999999999).toString(),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        status: "success",
        message: "Order was retrieved successfully!",
        statusCode: 200,
      });
    },
  });
});

it("DELETE returns 200", async () => {
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
      name: "T-Shirt",
      description: "T-Shirt",
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
    .returning(["id", "price"])
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
    .executeTakeFirst();

  if (!createdCartItem) throw new Error("Cart item not created");

  const createdOrder = await db
    .insertInto("order")
    .values({
      total_amount:
        Number(createdProduct.price) * parseInt(createdCartItem.quantity),
      user_id: user.id,
      cart_id: createdCart.id,
      fulfillment_status: "pending",
    })
    .returningAll()
    .executeTakeFirst();

  if (!createdOrder) throw new Error("Order not created");

  await testApiHandler({
    appHandler,
    params: {
      id: createdOrder.id,
    },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data: {
          id: expect.any(String),
          user_id: user.id,
          fulfillment_status: "pending",
          cart_id: createdCart.id,
          total_amount: (99.94999999999999).toString(),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        status: "success",
        message: "Order was deleted successfully!",
        statusCode: 200,
      });
    },
  });
});

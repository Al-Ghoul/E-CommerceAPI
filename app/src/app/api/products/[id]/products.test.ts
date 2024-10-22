import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";

afterEach(async () => {
  await db.deleteFrom("product").execute();
  await db.deleteFrom("category").execute();
});

it("GET by id returns 200", async () => {
  const category = await db
    .insertInto("category")
    .values({ name: "test get", description: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!category) throw new Error("No category found");

  const product = await db
    .insertInto("product")
    .values({
      name: "test",
      description: "test",
      price: 10,
      stock_quantity: 10,
      category_id: category.id,
    })
    .returningAll()
    .executeTakeFirst();

  if (!product) throw new Error("No product found");

  await testApiHandler({
    params: {
      id: product.id,
    },
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: "GET" });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data: {
          ...product,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        status: "success",
        statusCode: 200,
      });
    },
  });
});

it("DELETE by id returns 200", async () => {
  const category = await db
    .insertInto("category")
    .values({ name: "test get", description: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!category) throw new Error("No category found");

  const product = await db
    .insertInto("product")
    .values({
      name: "test",
      description: "test",
      price: 10,
      stock_quantity: 10,
      category_id: category.id,
    })
    .returningAll()
    .executeTakeFirst();

  if (!product) throw new Error("No product found");

  await testApiHandler({
    params: {
      id: product.id,
    },
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: "DELETE" });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data: {
          ...product,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        status: "success",
        statusCode: 200,
      });
    },
  });
});

it("PATCH by id returns 200", async () => {
  const category = await db
    .insertInto("category")
    .values({ name: "test get", description: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!category) throw new Error("No category found");

  const product = await db
    .insertInto("product")
    .values({
      name: "test",
      description: "test",
      price: 10,
      stock_quantity: 10,
      category_id: category.id,
    })
    .returningAll()
    .executeTakeFirst();

  if (!product) throw new Error("No product found");
  const inputData = {
    name: "test updated",
    description: "description updated",
    price: 20,
    stock_quantity: 20,
    category_id: category.id,
  };

  await testApiHandler({
    params: {
      id: product.id,
    },
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({
        method: "PATCH",
        body: JSON.stringify(inputData),
      });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data: {
          ...Object.keys(inputData).map((key) => ({
            [key]: expect.any(String),
          }))[0],
        },
        status: "success",
        statusCode: 200,
      });
    },
  });
});

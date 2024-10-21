import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";

afterEach(async () => {
  await db.deleteFrom("product").execute();
  await db.deleteFrom("category").execute();
});

it("GET returns 200", async () => {
  const category = await db
    .insertInto("category")
    .values({ name: "test category", description: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!category) throw new Error("Category not found");

  await testApiHandler({
    appHandler,
    params: {
      id: category.id,
    },
    test: async ({ fetch }) => {
      const response = await fetch({ method: "GET" });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toStrictEqual({
        data: [],
        meta: {
          count: 0,
          current_page: 1,
          has_next_page: false,
          has_previous_page: false,
          last_page: 0,
          per_page: 1,
          total: "0",
        },
        status: "success",
        statusCode: 200,
      });
    },
  });
});

it("POST returns 201", async () => {
  const category = await db
    .insertInto("category")
    .values({ name: "test category", description: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!category) throw new Error("Category not found");

  await testApiHandler({
    appHandler,
    params: {
      id: category.id,
    },
    test: async ({ fetch }) => {
      const data = {
        name: "test",
        description: "test",
        price: 10,
        stock_quantity: 10,
      };
      const response = await fetch({
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await response.json();
      expect(response.status).toBe(201);
      expect(json).toMatchObject({
        data: {
          ...Object.keys(data).map((key) => ({
            [key]: expect.any(String),
          }))[0],
        },
        status: "success",
        message: "Product was created successfully!",
        statusCode: 201,
      });
    },
  });
});

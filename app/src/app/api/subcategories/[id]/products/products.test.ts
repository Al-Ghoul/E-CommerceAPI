import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";
import { CreateUserAndGetToken } from "@/testUtils";

afterEach(async () => {
  await db.deleteFrom("user").execute();
  await db.deleteFrom("account").execute();
  await db.deleteFrom("product").execute();
  await db.deleteFrom("category").execute();
});

it("POST returns 201", async () => {
  const { access_token } = await CreateUserAndGetToken();
  const createdCategory = await db
    .insertInto("category")
    .values({ name: "test category", description: "test", icon: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!createdCategory) throw new Error("Category not found");

  const createdSubCategory = await db
    .insertInto("subcategory")
    .values({
      name: "test subcategory",
      description: "test",
      category_id: createdCategory.id,
    })
    .returningAll()
    .executeTakeFirst();

  if (!createdSubCategory) throw new Error("SubCategory not found");

  await testApiHandler({
    appHandler,
    params: {
      id: createdSubCategory.id,
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
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
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

it("GET returns 200", async () => {
  const createdCategory = await db
    .insertInto("category")
    .values({ name: "test category", description: "test", icon: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!createdCategory) throw new Error("Category not found");

  const createdSubCategory = await db
    .insertInto("subcategory")
    .values({
      name: "test subcategory",
      description: "test",
      category_id: createdCategory.id,
    })
    .returningAll()
    .executeTakeFirst();

  if (!createdSubCategory) throw new Error("SubCategory not found");

  await testApiHandler({
    appHandler,
    params: {
      id: createdSubCategory.id,
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

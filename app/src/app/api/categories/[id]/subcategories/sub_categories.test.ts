import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";
import { CreateUserAndGetToken } from "@/testUtils";

afterEach(async () => {
  await db.deleteFrom("user").execute();
  await db.deleteFrom("account").execute();
  await db.deleteFrom("category").execute();
});

it("GET returns 200", async () => {
  const createdCategory = await db
    .insertInto("category")
    .values({ name: "Clothing", description: "Clothing", icon: "clothing" })
    .returning("id")
    .executeTakeFirst();

  if (!createdCategory) throw new Error("Category not created");

  await testApiHandler({
    appHandler,
    params: {
      id: createdCategory.id,
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
  const { access_token } = await CreateUserAndGetToken();
  const createdCategory = await db
    .insertInto("category")
    .values({ name: "Clothing", description: "Clothing", icon: "clothing" })
    .returning("id")
    .executeTakeFirst();

  if (!createdCategory) throw new Error("Category not created");

  await testApiHandler({
    appHandler,
    params: {
      id: createdCategory.id,
    },
    test: async ({ fetch }) => {
      const data = { name: "test", description: "test" };
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
        data,
        status: "success",
        message: "SubCategory was created successfully!",
        statusCode: 201,
      });
    },
  });
});

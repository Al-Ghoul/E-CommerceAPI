import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";

afterEach(async () => {
  await db.deleteFrom("product").execute();
  await db.deleteFrom("category").execute();
});

it("GET by id returns 200", async () => {
  const createdCategory = await db
    .insertInto("category")
    .values({ name: "test get", description: "test", icon: "test" })
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
    params: {
      id: createdSubCategory.id,
    },
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: "GET" });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data: {
          ...createdSubCategory,
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
  const createdCategory = await db
    .insertInto("category")
    .values({ name: "test delete", description: "test", icon: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!createdCategory) throw new Error("No data found");

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
    params: {
      id: createdSubCategory.id,
    },
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: "DELETE" });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data: {
          ...createdSubCategory,
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
  const createdCategory = await db
    .insertInto("category")
    .values({ name: "test patch", description: "test", icon: "test" })
    .returningAll()
    .executeTakeFirst();

  if (!createdCategory) throw new Error("No data found");

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

  const inputData = {
    name: "test updated",
    description: "description updated",
  };

  await testApiHandler({
    params: {
      id: createdSubCategory.id,
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
          ...inputData,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        status: "success",
        statusCode: 200,
      });
    },
  });
});
import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";
import { CreateUserAndGetToken } from "@/testUtils";

afterEach(async () => {
  await db.deleteFrom("user").execute();
  await db.deleteFrom("account").execute();
  await db.deleteFrom("cart").execute();
});

it("POST returns 201", async () => {
  const { user, access_token } = await CreateUserAndGetToken();

  await testApiHandler({
    appHandler,
    params: {
      id: user.id,
    },
    test: async ({ fetch }) => {
      const data = { status: "active" };
      const response = await fetch({
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const json = await response.json();
      expect(response.status).toBe(201);
      expect(json).toMatchObject({
        data,
        status: "success",
        message: "Cart was created successfully!",
        statusCode: 201,
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

  await testApiHandler({
    appHandler,
    params: {
      id: user.id,
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
          ...createdCart,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        status: "success",
        message: "Cart was fetched successfully!",
        statusCode: 200,
      });
    },
  });
});

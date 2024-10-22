import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";
import { CreateUserAndGetToken } from "@/testUtils";

afterEach(async () => {
  await db.deleteFrom("user").execute();
  await db.deleteFrom("account").execute();
  await db.deleteFrom("cart").execute();
});

it("PATCH returns 200", async () => {
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
      id: createdCart.id,
    },
    test: async ({ fetch }) => {
      const data = { status: "checked_out" };
      const response = await fetch({
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json).toMatchObject({
        data,
        status: "success",
        message: "Cart was updated successfully!",
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

  await testApiHandler({
    appHandler,
    params: {
      id: createdCart.id,
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
        status: "success",
        message: "Cart was deleted successfully!",
        statusCode: 200,
      });
    },
  });
});

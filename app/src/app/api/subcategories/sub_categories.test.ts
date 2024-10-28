import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route";
import { db } from "@/db";

afterEach(async () => {
  await db.deleteFrom("user").execute();
  await db.deleteFrom("account").execute();
  await db.deleteFrom("category").execute();
});

it("GET returns 200", async () => {
  await testApiHandler({
    appHandler,
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



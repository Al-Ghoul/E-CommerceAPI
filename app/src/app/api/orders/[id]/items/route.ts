import * as jose from "jose";
import { db } from "@/db";
import { type NextRequest } from "next/server";
import { VerifyAccessToken } from "@/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken =
      req.headers.get("authorization")?.split(" ")[1] ||
      req.cookies.get("access_token")?.value;
    const tokenData = await VerifyAccessToken(accessToken!);

    /* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
    const user_id = tokenData.payload.sub?.split("|")[1]!;
    const selectedOrder = await db
      .selectFrom("order")
      .select(["id"])
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .executeTakeFirst();

    if (!selectedOrder) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Order not found.",
          detail: "Please check the order ID and try again.",
        }),
        {
          status: 404,
        },
      );
    }

    const orderItems = await db
      .selectFrom("order_item")
      .innerJoin("product", "order_item.product_id", "product.id")
      .select([
        "product.name as name",
        "order_item.id as id",
        "order_item.quantity as quantity",
        "order_item.price_at_purchase as price_at_purchase",
        "order_item.created_at as created_at",
        "order_item.updated_at as updated_at",
      ])
      .where("order_id", "=", selectedOrder.id)
      .execute();

    return new Response(
      JSON.stringify({
        data: orderItems,
        status: "success",
        message: "Order items were retrieved successfully!",
        statusCode: 200,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    if (err instanceof jose.errors.JOSEError) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 401,
          message: "Invalid or expired access token",
          detail: "Please re-login",
        }),
        { status: 401 },
      );
    }

    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "Couldn't parse your request, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}

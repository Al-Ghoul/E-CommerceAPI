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

    const order = await db
      .selectFrom("order")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .selectAll()
      .executeTakeFirst();

    if (!order) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Order not found!",
          detail: "Please make sure you entered the correct order ID.",
        }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        data: order,
        status: "success",
        message: "Order was retrieved successfully!",
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

export async function DELETE(
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

    const deletedOrder = await db
      .deleteFrom("order")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .returningAll()
      .executeTakeFirst();

    if (!deletedOrder) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Order not found!",
          detail: "Please make sure you entered the correct order ID.",
        }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        data: deletedOrder,
        status: "success",
        message: "Order was deleted successfully!",
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

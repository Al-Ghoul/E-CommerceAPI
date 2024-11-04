import * as jose from "jose";
import { db } from "@/db";
import { type NextRequest } from "next/server";
import { VerifyAccessToken } from "@/utils";
import { ShippingAddressInputSchema } from "@/zodTypes";
import { DatabaseError } from "pg";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken =
      req.headers.get("authorization")?.split(" ")[1] ||
      req.cookies.get("access_token")?.value;
    const jsonInput = await req.json();
    const validatedInput = ShippingAddressInputSchema.safeParse(jsonInput);
    const tokenData = await VerifyAccessToken(accessToken!);

    if (!validatedInput.success) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 400,
          errors: validatedInput.error.errors,
          detail: "Please make sure all fields are filled out correctly",
        }),
        {
          status: 400,
        },
      );
    }

    /* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
    const user_id = tokenData.payload.sub?.split("|")[1]!;
    const order = await db
      .selectFrom("order")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .where("fulfillment_status", "=", "pending")
      .select(["id"])
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

    const createdShippingInfo = await db
      .insertInto("shipping_info")
      .values({
        name: validatedInput.data.full_name,
        address: validatedInput.data.address,
        city: validatedInput.data.city,
        country: validatedInput.data.country,
        postal_code: validatedInput.data.postal_code,
        tracking_number: "XXXXX", // usually this should be randomly generated
        order_id: params.id,
      })
      .executeTakeFirst();

    return new Response(
      JSON.stringify({
        data: createdShippingInfo,
        status: "success",
        message: "Shipping info created successfully",
        statusCode: 201,
      }),
      {
        status: 201,
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
    } else if (err instanceof DatabaseError && err.code === "23505") {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 409,
          message: "Shipping info seems to exist.",
          detail: "Please make sure you entered the correct order ID.",
        }),
        {
          status: 409,
        },
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
    const orderShippingInfo = await db
      .selectFrom("order")
      .innerJoin("shipping_info", "shipping_info.order_id", "order.id")
      .where("order_id", "=", params.id)
      .where("user_id", "=", user_id)
      .where("fulfillment_status", "=", "processing")
      .select([
        "shipping_info.address",
        "shipping_info.city",
        "shipping_info.country",
        "shipping_info.postal_code",
      ])
      .executeTakeFirst();

    if (!orderShippingInfo) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Order or shipping info not found!",
          detail: "Please make sure you entered the correct order ID.",
        }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        data: orderShippingInfo,
        status: "success",
        message: "Shipping info retrieved successfully",
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
    } else if (err instanceof DatabaseError && err.code === "23505") {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 409,
          message: "Shipping info seems to exist.",
          detail: "Please make sure you entered the correct order ID.",
        }),
        {
          status: 409,
        },
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

import * as jose from "jose";
import { db } from "@/db";
import { type NextRequest } from "next/server";
import { VerifyAccessToken } from "@/utils";
import { CreditCardInputSchema, PaymentInputSchema } from "@/zodTypes";
import { DatabaseError } from "pg";
import { sql } from "kysely";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken =
      req.headers.get("authorization")?.split(" ")[1] ||
      req.cookies.get("access_token")?.value;
    const jsonInput = await req.json();
    const validatedInput = PaymentInputSchema.safeParse(jsonInput);
    const tokenData = await VerifyAccessToken(accessToken);

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

    const validatedCreditCardInput = CreditCardInputSchema.safeParse(jsonInput);
    if (!validatedCreditCardInput.success) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 400,
          errors: validatedCreditCardInput.error.errors,
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
      .updateTable("order")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .where("fulfillment_status", "=", "pending")
      .set({
        updated_at: new Date(),
        fulfillment_status: "processing",
      })
      .returningAll()
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
    const createdPaymentInfo = await db
      .insertInto("payment_info")
      .values({
        order_id: params.id,
        method: validatedInput.data.payment_method,
        amount: validatedInput.data.amount,
        transaction_id: "XXXXXXX", // should be auto generated or taken from the provider
        provider: validatedInput.data.payment_method,
      })
      .returning(["id"])
      .executeTakeFirst();

    if (!createdPaymentInfo) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 400,
          detail: "Couldn't create a new payment.",
          message: "Please try again later.",
        }),
        {
          status: 400,
        },
      );
    }

    if (validatedInput.data.payment_method === "credit_card") {
      await db
        .insertInto("card_info")
        .values({
          ...validatedCreditCardInput.data,
          payment_info_id: createdPaymentInfo.id,
        })
        .executeTakeFirst();
    }

    return new Response(
      JSON.stringify({
        data: createdPaymentInfo,
        status: "success",
        message: "Payment was created successfully!",
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
          message: "Payment info seems to exist.",
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
    const tokenData = await VerifyAccessToken(accessToken);

    /* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
    const user_id = tokenData.payload.sub?.split("|")[1]!;
    const orderPaymentInfo = await db
      .selectFrom("order")
      .leftJoin("payment_info", "order.id", "payment_info.order_id")
      .leftJoin(
        "card_info",
        (join) =>
          join
            .onRef("card_info.payment_info_id", "=", "payment_info.id")
            .on(sql`payment_info.method = 'credit_card'`), // conditional join based on method
      )
      .leftJoin(
        "paypal_info",
        (join) =>
          join
            .onRef("paypal_info.payment_info_id", "=", "payment_info.id")
            .on(sql`payment_info.method = 'paypal'`), // conditional join based on method
      )
      .select([
        "order.id as order_id",
        "payment_info.method as payment_method",
        "payment_info.amount as amount",
        "card_info.card_number",
        "card_info.card_holder",
        "paypal_info.email as paypal_email",
      ])
      .where("order.id", "=", params.id)
      .where("order.user_id", "=", user_id)
      .executeTakeFirst();

    if (!orderPaymentInfo) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Order not found or payment info not found!",
          detail: "Please make sure you entered the correct order ID.",
        }),
        {
          status: 404,
        },
      );
    }
    return new Response(
      JSON.stringify({
        data: orderPaymentInfo,
        status: "success",
        message: "Payment was retrieved successfully!",
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
          message: "Payment info seems to exist.",
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

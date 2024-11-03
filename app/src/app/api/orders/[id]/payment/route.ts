import * as jose from "jose";
import { db } from "@/db";
import { type NextRequest } from "next/server";
import { VerifyAccessToken } from "@/utils";
import { CreditCardInputSchema, ShippingAddressInputSchema } from "@/zodTypes";

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
      .selectFrom("order")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .where("fulfillment_status", "=", "pending")
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
    const createdPaymentInfo = await db
      .insertInto("payment_info")
      .values({
        order_id: params.id,
        method: validatedInput.data.payment_method,
        amount: 1000,
        transaction_id: "XXXXXXX", // should be auto generated or taken from the provider
        provider: validatedInput.data.payment_method,
        customer_reference_id: "XXXX", // Should be taken fron the provider
      })
      .returning(["id"])
      .executeTakeFirst();

    if (!createdPaymentInfo) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 400,
          detail: "Couldn't create a new payment.",
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

    await db
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

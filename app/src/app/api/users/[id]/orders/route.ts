import { z } from "zod";
import * as jose from "jose";
import { db } from "@/db";
import "@/globals";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    const jsonInput = await req.json();
    const validatedInput = OrdersInputSchema.safeParse(jsonInput);

    const tokenData = await jose.jwtVerify(
      accessToken!,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
      {
        typ: "access",
        issuer: process.env.TOKEN_ISSUER,
        audience: process.env.TOKEN_ISSUER,
      },
    );

    const user_id = tokenData.payload.sub?.split("|")[1]!;
    if (params.id !== user_id) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 401,
          message: "Unauthorized",
          detail: "You are not authorized to access this resource",
        }),
        {
          status: 401,
        },
      );
    }

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

    const selectedCart = await db
      .updateTable("cart")
      .where("user_id", "=", user_id)
      .where("id", "=", validatedInput.data.cart_id)
      .where("status", "=", "active")
      .set({ status: "checked_out", updated_at: new Date() })
      .returning("id")
      .executeTakeFirst();

    if (!selectedCart) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart was not found!",
          detail:
            "Please make sure you entered the correct cart ID and that is active.",
        }),
        {
          status: 404,
        },
      );
    }

    const cartItems = await db
      .selectFrom("cart_item")
      .where("cart_id", "=", selectedCart.id)
      .innerJoin("product", "product.id", "cart_item.product_id")
      .selectAll()
      .execute();

    let total_amount = 0;
    for (const item of cartItems) {
      total_amount += Number(item?.price) * parseInt(item?.quantity);
    }

    const createdOrder = await db
      .insertInto("order")
      .values({
        total_amount,
        user_id,
        cart_id: selectedCart.id,
        fulfillment_status: "pending",
      })
      .returningAll()
      .executeTakeFirst();

    if (!createdOrder) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 500,
          message: "Couldn't create your order, please try again later!",
        }),
        {
          status: 500,
        },
      );
    }

    for (const item of cartItems) {
      await db
        .insertInto("order_item")
        .values({
          order_id: createdOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: Number(item.price),
        })
        .execute();
    }

    return new Response(
      JSON.stringify({
        data: createdOrder,
        status: "success",
        statusCode: 201,
        message: "Order was created successfully!",
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

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    const tokenData = await jose.jwtVerify(
      accessToken!,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
      {
        typ: "access",
        issuer: process.env.TOKEN_ISSUER,
        audience: process.env.TOKEN_ISSUER,
      },
    );

    const user_id = tokenData.payload.sub?.split("|")[1]!;
    if (params.id != user_id) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 401,
          message: "Unauthorized access.",
        }),
        {
          status: 401,
        },
      );
    }

    const orders = await db
      .selectFrom("order")
      .where("user_id", "=", user_id)
      .selectAll()
      .execute();

    return new Response(
      JSON.stringify({
        data: orders,
        status: "success",
        message: "Orders were retrieved successfully!",
        statusCode: 200,
      }),
      {
        status: 200,
      },
    );
  } catch {
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

export const OrdersInputSchema = z.object({
  cart_id: z.number().transform((value) => String(value)),
});

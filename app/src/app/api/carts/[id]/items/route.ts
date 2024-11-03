import { db } from "@/db";
import * as jose from "jose";
import { VerifyAccessToken } from "@/utils";
import { type NextRequest } from "next/server";
import { CartItemInputSchema } from "@/zodTypes";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken =
      req.headers.get("authorization")?.split(" ")[1] ||
      req.cookies.get("access_token")?.value;
    const jsonInput = await req.json();
    const validatedInput = CartItemInputSchema.safeParse(jsonInput);

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

    const selectedProduct = await db
      .selectFrom("product")
      .where("id", "=", validatedInput.data.product_id)
      .select(["id", "stock_quantity"])
      .executeTakeFirst();

    if (!selectedProduct) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Product not found!",
          detail: "Please make sure you entered the correct product ID.",
        }),
        {
          status: 404,
        },
      );
    }

    const newStockQuantity =
      parseInt(selectedProduct.stock_quantity) - validatedInput.data.quantity;
    if (newStockQuantity < 0) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 400,
          message: "Not enough stock!",
          detail: "Please make sure you entered a valid quantity.",
        }),
        {
          status: 400,
        },
      );
    }

    await db
      .updateTable("product")
      .set({
        stock_quantity: newStockQuantity.toString(),
        updated_at: new Date(),
      })
      .where("id", "=", validatedInput.data.product_id)
      .execute();

    /* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
    const user_id = tokenData.payload.sub?.split("|")[1]!;
    const selectedCart = await db
      .selectFrom("cart")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .where("status", "=", "active")
      .select(["user_id"])
      .executeTakeFirst();

    if (!selectedCart) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart not found!",
          detail:
            "Please make sure you entered the correct cart ID or that the cart is active.",
        }),
        {
          status: 404,
        },
      );
    }

    const createdCartItem = await db
      .insertInto("cart_item")
      .values({ ...validatedInput.data, cart_id: params.id })
      .returningAll()
      .executeTakeFirst();

    return new Response(
      JSON.stringify({
        data: createdCartItem,
        status: "success",
        message: "Cart item was created successfully!",
        statusCode: 201,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof jose.errors.JOSEError) {
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
        detail: error,
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
    const selectedCart = await db
      .selectFrom("cart")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .where("status", "=", "active")
      .executeTakeFirst();

    if (!selectedCart) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart not found!",
          detail:
            "Please make sure you entered the correct cart ID or that the cart is active.",
        }),
        {
          status: 404,
        },
      );
    }

    const cartItems = await db
      .selectFrom("product")
      .innerJoin("cart_item", "product.id", "cart_item.product_id")
      .where("cart_item.cart_id", "=", params.id)
      .select([
        "product.id",
        "product.name as name",
        "product.description as description",
        "product.price as price",
        "cart_item.quantity",
        "cart_item.id",
        "cart_item.created_at",
        "cart_item.updated_at",
      ])
      .execute();

    return new Response(
      JSON.stringify({
        data: cartItems,
        status: "success",
        message: "Cart items were retrieved successfully!",
        statusCode: 200,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof jose.errors.JOSEError) {
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
        detail: error,
      }),
      {
        status: 500,
      },
    );
  }
}

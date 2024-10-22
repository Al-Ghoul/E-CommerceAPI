import { z } from "zod";
import * as jose from "jose";
import { db } from "@/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; item_id: string } },
) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    const jsonInput = await req.json();
    const validatedInput = CartItemPatchInputSchema.safeParse(jsonInput);

    const tokenData = await jose.jwtVerify(
      accessToken!,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
      {
        typ: "access",
        issuer: process.env.TOKEN_ISSUER,
        audience: process.env.TOKEN_ISSUER,
      },
    );

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

    const user_id = tokenData.payload.sub?.split("|")[1]!;
    const selectedCart = await db
      .selectFrom("cart")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .where("status", "=", "active")
      .select(["id"])
      .executeTakeFirst();

    if (!selectedCart) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart not found or not active!",
          detail:
            "Please make sure you entered the correct cart ID and that is active.",
        }),
        {
          status: 404,
        },
      );
    }
    const selectedCartItem = await db
      .selectFrom("cart_item")
      .where("id", "=", params.item_id)
      .where("cart_id", "=", params.id)
      .select(["quantity", "product_id"])
      .executeTakeFirst();

    if (!selectedCartItem) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Item not found!",
          detail: "Please make sure you entered the correct item ID.",
        }),
        {
          status: 404,
        },
      );
    }

    const selectedProduct = await db
      .selectFrom("product")
      .where("id", "=", selectedCartItem.product_id)
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

    let difference: number;
    const cartItemQuantity = parseInt(selectedCartItem.quantity);
    if (validatedInput.data.quantity > cartItemQuantity) {
      difference = validatedInput.data.quantity - cartItemQuantity;
      if (difference > parseInt(selectedProduct.stock_quantity)) {
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
      // Decrease stock quantity
      await db
        .updateTable("product")
        .set({
          stock_quantity: (
            parseInt(selectedProduct.stock_quantity) - difference
          ).toString(),
          updated_at: new Date(),
        })
        .where("id", "=", selectedCartItem.product_id)
        .execute();
    } else {
      difference = cartItemQuantity - validatedInput.data.quantity;

      // Increase stock quantity
      await db
        .updateTable("product")
        .set({
          stock_quantity: (
            parseInt(selectedProduct.stock_quantity) + difference
          ).toString(),
          updated_at: new Date(),
        })
        .where("id", "=", selectedCartItem.product_id)
        .execute();
    }

    const updatedCartItem = await db
      .updateTable("cart_item")
      .set({
        quantity: validatedInput.data.quantity.toString(),
        updated_at: new Date(),
      })
      .where("id", "=", params.item_id)
      .returningAll()
      .executeTakeFirst();

    return new Response(
      JSON.stringify({
        data: updatedCartItem,
        status: "success",
        message: "Cart item was updated successfully!",
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; item_id: string } },
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
            "Please make sure you entered the correct cart ID and that is active.",
        }),
        {
          status: 404,
        },
      );
    }

    const selectedCartItem = await db
      .selectFrom("cart_item")
      .where("id", "=", params.item_id)
      .where("cart_id", "=", params.id)
      .select("product_id")
      .executeTakeFirst();

    if (!selectedCartItem) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart item not found!",
          detail: "Please make sure you entered the correct cart item ID.",
        }),
        {
          status: 404,
        },
      );
    }
    const selectedProduct = await db
      .selectFrom("product")
      .where("id", "=", selectedCartItem.product_id)
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

    const deletedCartItem = await db
      .deleteFrom("cart_item")
      .where("id", "=", params.item_id)
      .where("cart_id", "=", params.id)
      .where("product_id", "=", selectedProduct.id)
      .returningAll()
      .executeTakeFirst();

    if (!deletedCartItem) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart item not found!",
          detail: "Please make sure you entered the correct cart item ID.",
        }),
        {
          status: 404,
        },
      );
    }

    // Put back the quantity into the stoc
    await db
      .updateTable("product")
      .set({
        stock_quantity: (
          parseInt(selectedProduct.stock_quantity) +
          parseInt(deletedCartItem.quantity)
        ).toString(),
        updated_at: new Date(),
      })
      .where("id", "=", deletedCartItem.product_id)
      .execute();

    return new Response(
      JSON.stringify({
        data: deletedCartItem,
        status: "success",
        message: "Cart item was deleted successfully!",
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

export const CartItemPatchInputSchema = z.object({
  quantity: z.number(),
});

import { z } from "zod";
import { db } from "@/db";
import * as jose from "jose";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    const jsonInput = await req.json();
    const validatedInput = CartPatchInputSchema.safeParse(jsonInput);

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

    /* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
    const user_id = tokenData.payload.sub?.split("|")[1]!;
    const selectedCart = await db
      .selectFrom("cart")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .select(["user_id", "status"])
      .executeTakeFirst();

    if (!selectedCart) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart not found!",
          detail: "Please make sure you entered the correct cart ID",
        }),
        {
          status: 404,
        },
      );
    }

    if (selectedCart.status === "checked_out") {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 409,
          message: "Cart already checked out.",
        }),
        {
          status: 409,
        },
      );
    }

    if (selectedCart.status === "archived") {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 409,
          message: "Cart already archived.",
        }),
        {
          status: 409,
        },
      );
    }

    /* eslint @typescript-eslint/no-explicit-any: off */
    const inputData: any = {};
    for (const [key, value] of Object.entries(validatedInput.data)) {
      if (value) {
        if (key === "status") {
          if (value === "checked_out") {
            inputData["checked_out_at"] = new Date();
          }
          if (value === "archived") {
            inputData["archived_at"] = new Date();
          }
        }
        inputData[key] = value;
      }
    }

    try {
      const updatedCartResult = await db
        .updateTable("cart")
        .set({ ...inputData, updated_at: new Date() })
        .where("id", "=", params.id)
        .returningAll()
        .executeTakeFirst();

      return new Response(
        JSON.stringify({
          data: updatedCartResult,
          status: "success",
          message: "Cart was updated successfully!",
          statusCode: 200,
        }),
        {
          status: 200,
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 500,
          message: "We couldn't handle your request, please try again later!",
          detail: error,
        }),
        {
          status: 500,
        },
      );
    }
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

    /* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
    const user_id = tokenData.payload.sub?.split("|")[1]!;
    const cartData = await db
      .selectFrom("cart")
      .where("id", "=", params.id)
      .where("user_id", "=", user_id)
      .select(["user_id"])
      .executeTakeFirst();

    if (!cartData) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart not found!",
          detail: "Please make sure you entered the correct cart ID",
        }),
        {
          status: 404,
        },
      );
    }

    const result = await db
      .deleteFrom("cart")
      .where("id", "=", params.id)
      .returningAll()
      .executeTakeFirst();

    return new Response(
      JSON.stringify({
        data: result,
        status: "success",
        message: "Cart was deleted successfully!",
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
        message: "We couldn't handle your request, please try again later!",
        detail: error,
      }),
      {
        status: 500,
      },
    );
  }
}

const CartPatchInputSchema = z.object({
  status: z.enum(["active", "archived", "checked_out"]).optional(),
});

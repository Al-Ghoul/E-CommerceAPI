import { db } from "@/db";
import * as jose from "jose";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const accessToken = req.headers.get("authorization")?.split(" ")[1];

  try {
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

    const getCart = await db
      .selectFrom("cart")
      .select(["id"])
      .where("user_id", "=", user_id)
      .where("status", "=", "active")
      .executeTakeFirst();

    if (getCart) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 409,
          message: "Cart already exists.",
        }),
        {
          status: 409,
        },
      );
    }

    const result = await db
      .insertInto("cart")
      .values({
        user_id: user_id,
        status: "active",
      })
      .returningAll()
      .executeTakeFirst();

    return new Response(
      JSON.stringify({
        data: result,
        status: "success",
        message: "Cart was created successfully!",
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
        message: "Something went wrong. Please try again later.",
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
  const accessToken = req.headers.get("authorization")?.split(" ")[1];

  try {
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

    const cart = await db
      .selectFrom("cart")
      .selectAll()
      .where("user_id", "=", params.id)
      .where("status", "=", "active")
      .executeTakeFirst();

    if (!cart) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Cart not found.",
          detail: "There's no active cart, please create one.",
        }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        data: cart,
        status: "success",
        message: "Cart was fetched successfully!",
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
        message: "Something went wrong. Please try again later.",
      }),
      {
        status: 500,
      },
    );
  }
}

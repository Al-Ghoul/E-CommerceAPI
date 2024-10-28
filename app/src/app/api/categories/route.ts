import { CategoriesInputSchema } from "@/zodTypes";
import { db } from "@/db";
import { DatabaseError } from "pg";
import { type NextRequest } from "next/server";
import * as jose from "jose";
import "@/globals";

export async function POST(req: Request) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    const jsonInput = await req.json();
    const validatedInput = CategoriesInputSchema.safeParse(jsonInput);

    await jose.jwtVerify(
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

    try {
      const result = await db
        .insertInto("category")
        .values(validatedInput.data)
        .returningAll()
        .executeTakeFirst();

      return new Response(
        JSON.stringify({
          data: result,
          status: "success",
          message: "Category was created successfully!",
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
            message: "Category seems to exists.",
          }),
          {
            status: 409,
          },
        );
      } else {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 500,
            message:
              "We couldn't create the new category, please try again later!",
          }),
          {
            status: 500,
          },
        );
      }
    }
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

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || 1;
  const offset = Number(searchParams.get("offset")) || 0;

  try {
    const categories = await db
      .selectFrom("category")
      .orderBy("created_at", "asc")
      .limit(limit + 1)
      .offset(offset)
      .selectAll()
      .execute();

    const totalCategories = await db
      .selectFrom("category")
      .select(({ fn }) => [fn.countAll().as("total")])
      .execute();

    const categoriesData = categories.slice(
      0,
      categories.length > limit + 1 ? categories.length - 1 : limit,
    );

    return new Response(
      JSON.stringify({
        data: categoriesData,
        status: "success",
        statusCode: 200,
        meta: {
          has_next_page: categories.length > limit,
          has_previous_page: offset > 0,
          total: totalCategories[0].total,
          count: categoriesData.length,
          current_page: offset / limit + 1,
          per_page: limit,
          last_page: Math.ceil(Number(totalCategories[0].total) / limit),
        },
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

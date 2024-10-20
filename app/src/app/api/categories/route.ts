import { CategoriesInputSchema } from "@/zodTypes";
import { db } from "@/db";
import { DatabaseError } from "pg";
import { type NextRequest } from "next/server";

import "@/globals";

export async function POST(req: Request) {
  try {
    const jsonInput = await req.json();
    const validatedInput = CategoriesInputSchema.safeParse(jsonInput);

    if (!validatedInput.success) {
      const { errors } = validatedInput.error;

      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 400,
          errors,
          detail: "Please make sure all fields are filled out correctly",
        }),
        {
          status: 400,
        },
      );
    }
    const { name, description } = validatedInput.data;

    try {
      const result = await db
        .insertInto("category")
        .values({
          name,
          description,
        })
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
      if (err instanceof DatabaseError && err.code === "23505") {
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
  } catch (err) {
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
  const limit = searchParams.get("limit") || 1;
  const offset = searchParams.get("offset") || 0;

  try {
    const categories = await db
      .selectFrom("category")
      .orderBy("created_at", "asc")
      .limit(Number(limit) + 1)
      .offset(Number(offset))
      .selectAll()
      .execute();

    const totalCategories = await db
      .selectFrom("category")
      .select(({ fn }) => [fn.countAll().as("total")])
      .execute();

    const categoriesData = categories.slice(
      0,
      categories.length > Number(limit) + 1
        ? categories.length - 1
        : Number(limit),
    );

    return new Response(
      JSON.stringify({
        data: categoriesData,
        status: "success",
        statusCode: 200,
        meta: {
          has_next_page: categories.length > Number(limit),
          has_previous_page: Number(offset) > 0,
          total: totalCategories[0].total,
          count: categoriesData.length,
          current_page: Number(offset) / Number(limit) + 1,
          per_page: Number(limit),
          last_page: Math.ceil(
            Number(totalCategories[0].total) / Number(limit),
          ),
        },
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
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

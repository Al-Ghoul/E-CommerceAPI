import { ProductsInputSchema } from "@/zodTypes";
import { db } from "@/db";
import { DatabaseError } from "pg";
import { type NextRequest } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const jsonInput = await req.json();
    const validatedInput = ProductsInputSchema.safeParse(jsonInput);

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
      const category = await db
        .selectFrom("category")
        .select(["id"])
        .where("id", "=", params.id)
        .executeTakeFirst();

      if (!category) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 404,
            message: "Category not found.",
            detail: "Please make sure you entered the correct category ID",
          }),
          {
            status: 404,
          },
        );
      }

      const result = await db
        .insertInto("product")
        .values({
          ...validatedInput.data,
          category_id: category.id,
        })
        .returningAll()
        .executeTakeFirst();

      return new Response(
        JSON.stringify({
          data: result,
          status: "success",
          message: "Product was created successfully!",
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
            message: "Product seems to exists.",
          }),
          {
            status: 409,
          },
        );
      }
    }
  } catch (err) {
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
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = req.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || 1;
  const offset = Number(searchParams.get("offset")) || 0;

  try {
    const category = await db
      .selectFrom("category")
      .select(["id"])
      .where("id", "=", params.id)
      .executeTakeFirst();

    if (!category) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Category not found.",
          detail: "Please make sure you entered the correct category ID",
        }),
        {
          status: 404,
        },
      );
    }

    const products = await db
      .selectFrom("product")
      .where("category_id", "=", category.id)
      .selectAll()
      .limit(limit + 1)
      .offset(offset)
      .execute();

    const totalProducts = await db
      .selectFrom("product")
      .select(({ fn }) => [fn.countAll().as("total")])
      .execute();

    const productsData = products.slice(
      0,
      products.length > limit + 1 ? products.length - 1 : limit,
    );

    return new Response(
      JSON.stringify({
        data: productsData,
        status: "success",
        statusCode: 200,
        meta: {
          has_next_page: products.length > limit,
          has_previous_page: offset > 0,
          total: totalProducts[0].total,
          count: productsData.length,
          current_page: offset / limit + 1,
          per_page: limit,
          last_page: Math.ceil(Number(totalProducts[0].total) / limit),
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
        message: "Couldn't parse your request, Please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}

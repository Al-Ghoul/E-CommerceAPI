import { db } from "@/db";
import { type NextRequest } from "next/server";

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
      .innerJoin("subcategory", "subcategory.id", "product.subcategory_id")
      .innerJoin("category", "category.id", "subcategory.category_id")
      .select([
        "product.id",
        "product.name as product_name",
        "product.description as product_description",
        "product.price",
        "product.stock_quantity",
        "subcategory.name as subcategory_name",
        "category.name as category_name",
      ])
      .where("category.id", "=", category.id)
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
    console.log(err);
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

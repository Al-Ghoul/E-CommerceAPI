import { db } from "@/db";
import { sql, SqlBool } from "kysely";
import { type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q") + ":*";

  try {
    const products = await db
      .selectFrom("product")
      .innerJoin("subcategory", "subcategory.id", "product.subcategory_id")
      .innerJoin("category", "category.id", "subcategory.category_id")
      .select([
        "product.id",
        "product.name as name",
        "product.description as description",
        "product.price",
        "product.stock_quantity",
        "subcategory.name as subcategory_name",
        "category.name as category_name",
      ])
      .where("category.id", "=", params.id)
      .limit(10)
      .where(
        sql<SqlBool>`to_tsvector('simple', product.name) @@ to_tsquery('simple', ${query})`,
      )
      .execute();

    return new Response(
      JSON.stringify({
        data: products,
        status: "success",
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

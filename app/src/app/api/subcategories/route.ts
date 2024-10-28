import { db } from "@/db";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || 1;
  const offset = Number(searchParams.get("offset")) || 0;

  try {
    const subCategories = await db
      .selectFrom("subcategory")
      .orderBy("created_at", "asc")
      .limit(limit + 1)
      .offset(offset)
      .selectAll()
      .execute();

    const totalSubCategories = await db
      .selectFrom("subcategory")
      .select(({ fn }) => [fn.countAll().as("total")])
      .execute();

    const subCategoriesData = subCategories.slice(
      0,
      subCategories.length > limit + 1 ? subCategories.length - 1 : limit,
    );

    return new Response(
      JSON.stringify({
        data: subCategoriesData,
        status: "success",
        statusCode: 200,
        meta: {
          has_next_page: subCategories.length > limit,
          has_previous_page: offset > 0,
          total: totalSubCategories[0].total,
          count: subCategoriesData.length,
          current_page: offset / limit + 1,
          per_page: limit,
          last_page: Math.ceil(Number(totalSubCategories[0].total) / limit),
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

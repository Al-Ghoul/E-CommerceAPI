import { db } from "@/db";
import { sql, SqlBool } from "kysely";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q") + ":*";

  try {
    const categories = await db
      .selectFrom("category")
      .selectAll()
      .limit(10)
      .where(
        sql<SqlBool>`to_tsvector('simple', name) || to_tsvector('simple', description) @@ to_tsquery('simple', ${query})`,
      )
      .execute();

    return new Response(
      JSON.stringify({
        data: categories,
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

import { SubCategoriesInputSchema } from "@/zodTypes";
import { db } from "@/db";
import * as jose from "jose";
import { DatabaseError } from "pg";
import { type NextRequest } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    const jsonInput = await req.json();
    const validatedInput = SubCategoriesInputSchema.safeParse(jsonInput);

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
        .insertInto("subcategory")
        .values({ ...validatedInput.data, category_id: params.id })
        .returningAll()
        .executeTakeFirst();

      return new Response(
        JSON.stringify({
          data: result,
          status: "success",
          message: "SubCategory was created successfully!",
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
            message: "SubCategory seems to exists.",
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
              "We couldn't create the new subcategory, please try again later!",
          }),

          {
            status: 500,
          },
        );
      }
    }
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
        message:
          "We couldn't create the new subcategory, please try again later!",
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
    const subCategories = await db
      .selectFrom("subcategory")
      .where("category_id", "=", params.id)
      .orderBy("created_at", "asc")
      .limit(limit + 1)
      .offset(offset)
      .selectAll()
      .execute();

    const totalSubCatgories = await db
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
          total: totalSubCatgories[0].total,
          count: subCategoriesData.length,
          current_page: offset / limit + 1,
          per_page: limit,
          last_page: Math.ceil(Number(totalSubCatgories[0].total) / limit),
        },
      }),
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't get the subcategories, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}

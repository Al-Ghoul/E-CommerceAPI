import { db } from "@/db";
import { CategoriesPatchInputSchema } from "@/zodTypes";
import "@/globals";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const subCategory = await db
      .selectFrom("subcategory")
      .selectAll()
      .where("id", "=", params.id)
      .executeTakeFirst();

    if (!subCategory) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Sub Category not found!",
          detail: "Please make sure you entered the correct category ID",
        }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        data: subCategory,
        status: "success",
        statusCode: 200,
      }),
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't get the sub category, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    const result = await db
      .deleteFrom("subcategory")
      .where("id", "=", params.id)
      .returningAll()
      .executeTakeFirst();

    if (!result) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Sub Category not found!",
          detail: "Please make sure you entered the correct sub category ID",
        }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        data: result,
        status: "success",
        message: "Sub Category was deleted successfully!",
        statusCode: 200,
      }),
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't delete the sub category, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const jsonInput = await req.json();
    // The fields are identical to the category's PATCH route
    const validatedInput = CategoriesPatchInputSchema.safeParse(jsonInput);

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
      if (Object.keys(validatedInput.data).length === 0) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 400,
            message: "No data provided to update!",
          }),
          {
            status: 400,
          },
        );
      }

      const result = await db
        .updateTable("category")
        .set({ ...validatedInput.data, updated_at: new Date() })
        .where("id", "=", params.id)
        .returningAll()
        .executeTakeFirst();

      if (!result) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 404,
            message: "Sub Category not found!",
            detail: "Please make sure you entered the correct sub category ID",
          }),
          {
            status: 404,
          },
        );
      }

      return new Response(
        JSON.stringify({
          data: result,
          status: "success",
          message: "Sub Category was updated successfully!",
          statusCode: 200,
        }),
      );
    } catch {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 500,
          message:
            "We couldn't update the sub category, please try again later!",
        }),
        {
          status: 500,
        },
      );
    }
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't update the sub category, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}
import { db } from "@/db";
import { CategoriesInputSchema } from "@/zodTypes";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const category = await db
      .selectFrom("category")
      .selectAll()
      .where("id", "=", params.id)
      .executeTakeFirst();

    if (!category) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Category not found!",
          detail: "Please make sure you entered the correct category ID",
        }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        data: category,
        status: "success",
        statusCode: 200,
      }),
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't get the category, please try again later!",
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
      .deleteFrom("category")
      .where("id", "=", params.id)
      .executeTakeFirst();

    if (result.numDeletedRows === BigInt(0)) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Category not found!",
          detail: "Please make sure you entered the correct category ID",
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
        message: "Category was deleted successfully!",
        statusCode: 200,
      }),
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't delete the category, please try again later!",
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
        .updateTable("category")
        .set({ name, description, updated_at: new Date() })
        .where("id", "=", params.id)
        .returningAll()
        .executeTakeFirst();

      if (!result) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 404,
            message: "Category not found!",
            detail: "Please make sure you entered the correct category ID",
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
          message: "Category was updated successfully!",
          statusCode: 200,
        }),
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 500,
          message: "We couldn't update the category, please try again later!",
        }),
        {
          status: 500,
        },
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't update the category, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}
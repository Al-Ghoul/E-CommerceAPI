import { db } from "@/db";
import { ProductsPatchInputSchema } from "@/zodTypes";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const category = await db
      .selectFrom("product")
      .selectAll()
      .where("id", "=", params.id)
      .executeTakeFirst();

    if (!category) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Product not found!",
          detail: "Please make sure you entered the correct product ID",
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
        message: "We couldn't get the product, please try again later!",
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
      .deleteFrom("product")
      .where("id", "=", params.id)
      .returningAll()
      .executeTakeFirst();

    if (!result) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 404,
          message: "Product not found!",
          detail: "Please make sure you entered the correct product ID",
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
        message: "Product was deleted successfully!",
        statusCode: 200,
      }),
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        statusCode: 500,
        message: "We couldn't delete the product, please try again later!",
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
    const validatedInput = ProductsPatchInputSchema.safeParse(jsonInput);

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
        .updateTable("product")
        .set({ ...validatedInput.data, updated_at: new Date() })
        .where("id", "=", params.id)
        .where("category_id", "=", category.id)
        .returningAll()
        .executeTakeFirst();

      if (!result) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 404,
            message: "Product not found!",
            detail: "Please make sure you entered the correct product ID",
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
          message: "Product was updated successfully!",
          statusCode: 200,
        }),
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          status: "error",
          statusCode: 500,
          message: "We couldn't update the product, please try again later!",
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
        message: "We couldn't update the product, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}

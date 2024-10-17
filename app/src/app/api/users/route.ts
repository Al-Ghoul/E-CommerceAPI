import { z } from "zod";
import { db } from "@/db";
import bcrypt from "bcrypt";
import { SqliteError } from "better-sqlite3";
const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const jsonInput = await request.json();
    const validatedInput = SignUpInputSchema.safeParse(jsonInput);

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
    const { email, password } = validatedInput.data;

    try {
      await db.transaction().execute(async (trx) => {
        const user = await trx
          .insertInto("user")
          .values({
            email,
          })
          .returning("id")
          .executeTakeFirstOrThrow();

        if (user && user.id) {
          return await trx
            .insertInto("account")
            .values({
              userId: user.id,
              password: await bcrypt.hash(password, SALT_ROUNDS),
              provider: "credentials",
              type: "credentials",
              providerAccountId: "credentials",
            })
            .executeTakeFirst();
        }
      });
    } catch (err) {
      if (err instanceof SqliteError && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 409,
            message:
              "Account seems to exist, request a password reset incase you've forgot the password",
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
            message: "We couldn't create your account, please try again later!",
          }),
          {
            status: 500,
          },
        );
      }
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Account was created successfully!",
        statusCode: 201,
      }),
      {
        status: 201,
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

const SignUpInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

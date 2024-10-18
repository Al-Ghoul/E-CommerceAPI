import * as jose from "jose";
import { z } from "zod";
import { db } from "@/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const jsonInput = await request.json();
    const validatedInput = SignInInputSchema.safeParse(jsonInput);

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

    try {
      const { email, password } = validatedInput.data;

      const user = await db
        .selectFrom("user")
        .where("email", "=", email)
        .select("user.id")
        .executeTakeFirst();

      if (!user) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 401,
            message: "Invalid credentials",
          }),
          {
            status: 401,
          },
        );
      }

      const account = await db
        .selectFrom("account")
        .where("account.id", "=", user?.id)
        .selectAll()
        .executeTakeFirst();

      if (
        account?.password &&
        !(await bcrypt.compare(password, account?.password))
      ) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 401,
            message: "Invalid credentials",
          }),
          {
            status: 401,
          },
        );
      }
      const access_token = await GenerateAccessToken(BigInt(user.id));
      const refresh_token = await GenerateRefreshToken(BigInt(user.id));

      await db
        .insertInto("token")
        .values({
          userId: user.id,
          token: refresh_token,
          type: "refresh",
          expires_in: 60 * 60 * 5,
          status: "valid",
        })
        .executeTakeFirst();

      await db
        .insertInto("token")
        .values({
          userId: user.id,
          token: access_token,
          type: "access",
          expires_in: 60 * 60 * 24 * 5,
          status: "valid",
        })
        .executeTakeFirst();

      return new Response(
        JSON.stringify({
          status: "success",
          statusCode: 200,
          access_token,
          refresh_token,
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
          message: "We couldn't handle your request, please try again later!",
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
        message: "Couldn't parse your request, please try again later!",
      }),
      {
        status: 500,
      },
    );
  }
}

async function GenerateAccessToken(userId: BigInt) {
  return await new jose.SignJWT()
    .setProtectedHeader({ alg: "HS256", typ: "access" })
    .setSubject(`E-Commerce-API|${userId.toString()}`)
    .setIssuer(process.env.TOKEN_ISSUER!)
    .setAudience(process.env.TOKEN_ISSUER!)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));
}

async function GenerateRefreshToken(userId: BigInt) {
  return await new jose.SignJWT({ typ: "refresh" })
    .setProtectedHeader({ alg: "HS256", typ: "refresh" })
    .setSubject(`E-Commerce-API|${userId.toString()}`)
    .setIssuer(process.env.TOKEN_ISSUER!)
    .setAudience(process.env.TOKEN_ISSUER!)
    .setIssuedAt()
    .setExpirationTime("5d")
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));
}

const SignInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

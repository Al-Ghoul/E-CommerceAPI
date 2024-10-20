import { z } from "zod";
import { db } from "@/db";
import { GenerateAccessToken, GenerateRefreshToken } from "@/utils";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    const jsonInput = await request.json();
    const validatedInput = RefreshInputSchema.safeParse(jsonInput);

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
      const input = validatedInput.data;

      await jose.jwtVerify(
        input.refresh_token,
        new TextEncoder().encode(process.env.TOKEN_SECRET),
        {
          typ: "refresh",
          issuer: process.env.TOKEN_ISSUER,
          audience: process.env.TOKEN_ISSUER,
        },
      );

      const token = await db
        .updateTable("token")
        .where("token.token", "=", input.refresh_token)
        .where("token.status", "=", "valid")
        .where("token.type", "=", "refresh")
        .set({ status: "invalid" })
        .returning("token.user_id")
        .executeTakeFirst();

      if (!token) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 401,
            message: "Invalid refresh token",
          }),
          {
            status: 401,
          },
        );
      }

      const access_token = await GenerateAccessToken(BigInt(token.user_id));
      const refresh_token = await GenerateRefreshToken(BigInt(token.user_id));

      await db
        .insertInto("token")
        .values({
          user_id: token.user_id,
          token: refresh_token,
          type: "refresh",
          expires_in: 60 * 60 * 5,
          status: "valid",
        })
        .executeTakeFirst();

      await db
        .insertInto("token")
        .values({
          user_id: token.user_id,
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
      if (err instanceof jose.errors.JOSEError) {
        return new Response(
          JSON.stringify({
            status: "error",
            statusCode: 401,
            message: "Invalid refresh token",
          }),
          {
            status: 401,
          },
        );
      }
      
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

const RefreshInputSchema = z.object({
  refresh_token: z.string(),
});

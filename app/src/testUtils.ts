import { db } from "@/db";
import bcrypt from "bcrypt";
import { GenerateAccessToken } from "@/utils";

export async function CreateUserAndGetToken() {
  const user = await db
    .insertInto("user")
    .values({ email: "test" })
    .returning("id")
    .executeTakeFirst();

  if (!user) throw new Error("User not created");

  const SALT_ROUNDS = 10;
  const password = "12345678";
  const account = await db
    .insertInto("account")
    .values({
      user_id: user.id,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      provider: "credentials",
      type: "credentials",
      providerAccount_id: "credentials",
    })
    .returning("id")
    .executeTakeFirst();
  const access_token = await GenerateAccessToken(BigInt(user.id));

  return { user, account, access_token };
}

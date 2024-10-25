"use server";
import { cookies } from "next/headers";

export async function deleteAuthCookieAction() {
  const cookieStore = cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

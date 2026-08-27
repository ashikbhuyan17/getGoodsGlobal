"use server";

import { cookies } from "next/headers";

/** Keep auth cookie across browser restarts (backend token is long-lived). */
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const TOKEN_COOKIE_OPTIONS = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  httpOnly: true,
  maxAge: TOKEN_MAX_AGE_SECONDS,
};

export const setToken = async (token: string) => {
  try {
    const cookiesStore = await cookies();
    cookiesStore.set("token", token, TOKEN_COOKIE_OPTIONS);
  } catch (error) {
    console.log("Token Error:", error);
  }
};

export const deleteToken = async () => {
  try {
    const cookiesStore = await cookies();
    cookiesStore.delete({
      name: "token",
      path: "/",
    });
  } catch (error) {
    console.log("Delete token error:", error);
  }
};

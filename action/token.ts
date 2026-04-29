"use server";

import { cookies } from "next/headers";

export const setToken = async (token: string) => {
  try {
    const cookiesStore = await cookies();
    cookiesStore.set("token", token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } catch (error) {
    console.log("Token Error:", error);
  }
};

"use server";

import { cookies } from "next/headers";

export const setToken = async (token: string) => {
  try {
    const cookiesStore = await cookies();
    cookiesStore.set("token", token, {
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    console.log("Token Error:", error);
  }
};

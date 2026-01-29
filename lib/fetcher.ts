"use server";

import { cookies } from "next/headers";

export async function fetcher<T>(
  slug: string,
  options: RequestInit = {},
  revalidate: number | false = 0
): Promise<T> {
  try {
    const cookiesStore = await cookies();
    const token = await cookiesStore.get("token")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
      ...options,
      next: revalidate ? { revalidate } : undefined,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
    });

    return res.json() as Promise<T>;
  } catch (error) {
    console.log("Fetcher Error:", error);
    throw error;
  }
}

"use server";

import { revalidatePath } from "next/cache";

export async function revalidateClient(path: string, type?: "page" | "layout") {
  revalidatePath(path, type);
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { guestbookEntries, GuestbookEntry } from "@/data/guestbook";

const guestbookSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "Tên không được quá 50 ký tự"),
  message: z.string().min(1, "Tin nhắn không được để trống"),
});

export async function addGuestbookEntry(prevState: any, formData: FormData) {
  const parsed = guestbookSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      success: false,
    };
  }

  const newEntry: GuestbookEntry = {
    id: Date.now().toString(),
    name: parsed.data.name,
    message: parsed.data.message,
    createdAt: new Date().toISOString(),
  };

  guestbookEntries.unshift(newEntry);
  revalidatePath("/guestbook");

  return {
    success: true,
    errors: {},
  };
}

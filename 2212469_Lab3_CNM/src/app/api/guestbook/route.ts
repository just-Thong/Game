import { NextResponse } from "next/server";
import { guestbookEntries, GuestbookEntry } from "@/data/guestbook";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  
  if (limit) {
    return NextResponse.json(guestbookEntries.slice(0, Number(limit)));
  }
  return NextResponse.json(guestbookEntries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || body.name.length < 2 || body.name.length > 50) {
      return NextResponse.json(
        { error: "Tên từ 2-50 ký tự" },
        { status: 400 }
      );
    }
    
    if (!body.message || body.message.trim() === "") {
        return NextResponse.json(
          { error: "Tin nhắn không được để trống" },
          { status: 400 }
        );
    }

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: body.name,
      message: body.message,
      createdAt: new Date().toISOString(),
    };

    guestbookEntries.unshift(newEntry);

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

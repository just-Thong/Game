import { NextResponse } from "next/server";
import { guestbookEntries } from "@/data/guestbook";

// Ensure dynamic parameters are handled properly in Next.js 15
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const index = guestbookEntries.findIndex((entry) => entry.id === resolvedParams.id);

  if (index !== -1) {
    guestbookEntries.splice(index, 1);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const index = guestbookEntries.findIndex((entry) => entry.id === resolvedParams.id);

    if (index !== -1) {
      if (body.name && (body.name.length < 2 || body.name.length > 50)) {
        return NextResponse.json(
          { error: "Tên từ 2-50 ký tự" },
          { status: 400 }
        );
      }
      
      guestbookEntries[index] = {
        ...guestbookEntries[index],
        ...body,
      };
      return NextResponse.json(guestbookEntries[index]);
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

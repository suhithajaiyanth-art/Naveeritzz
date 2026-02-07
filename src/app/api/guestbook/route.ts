import { NextRequest, NextResponse } from "next/server";
import { getMessages, addMessage } from "@/lib/db";

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

export async function GET() {
  try {
    const messages = getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error reading messages:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, message } = await request.json();

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const newWish = addMessage(
      name.trim(),
      message.trim(),
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );

    return NextResponse.json(newWish, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

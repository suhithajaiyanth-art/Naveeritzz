import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

const dataFile = path.join(process.cwd(), "data", "messages.json");

async function readMessages(): Promise<Wish[]> {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMessages(messages: Wish[]): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify(messages, null, 2));
}

export async function GET() {
  try {
    const messages = await readMessages();
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

    const messages = await readMessages();
    
    const newWish: Wish = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    };

    const updatedMessages = [newWish, ...messages];
    await writeMessages(updatedMessages);

    return NextResponse.json(newWish, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

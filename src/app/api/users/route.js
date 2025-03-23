import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  try {
    const users = await User.findAll();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in /api/users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

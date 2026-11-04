import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body.password || "";

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const user = verifyAdminPassword(password);
    if (!user) {
      return NextResponse.json(
        { error: "Incorrect admin password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true, user });
    response.cookies.set("bihardrive_session", encodeURIComponent(JSON.stringify(user)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

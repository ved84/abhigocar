import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const inquiries = store.getInquiries();
  return NextResponse.json({ inquiries });
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, district, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const inquiry = store.addInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      district: district || "patna",
      subject: subject || "General Inquiry",
      message: message.trim(),
    });

    return NextResponse.json({ success: true, inquiry });
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id, status } = await req.json();
  const ok = store.updateInquiryStatus(id, status);
  return NextResponse.json({ success: ok });
}

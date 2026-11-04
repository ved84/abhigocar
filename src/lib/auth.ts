import { cookies } from "next/headers";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bihardrive2026";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw =
    cookieStore.get("abhigocar_session")?.value ||
    cookieStore.get("abhicargo_session")?.value ||
    cookieStore.get("bihardrive_session")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as SessionUser;
  } catch {
    return null;
  }
}

export function verifyAdminPassword(pass: string): SessionUser | null {
  if (pass.trim() === ADMIN_PASSWORD.trim()) {
    return {
      id: "usr-admin-master",
      email: "admin@abhigocar.com",
      name: "Administrator",
      role: "ADMIN",
    };
  }
  return null;
}

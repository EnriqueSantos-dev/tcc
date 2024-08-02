import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia, validateRequest } from "./auth";

export async function setSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function getCurrentUser() {
  const session = await validateRequest();
  if (!session.user) {
    redirect("/login");
  }
  return session.user;
}

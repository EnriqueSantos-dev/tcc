"server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia, validateRequest } from "./auth";
import { cache } from "react";

export async function setSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    redirect("/login");
  }
  return session.user;
});

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ROLES } from "./lib/db/schemas";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/webhooks/clerk(.*)"
]);

const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  if (!isPublicRoute(req) && !userId) {
    await auth.protect();
  }

  const isBasicUser =
    !sessionClaims?.metadata?.role ||
    Boolean(sessionClaims?.metadata?.role === ROLES.BASIC);

  // Protect all routes starting with `/admin`
  if (isAdminRoute(req) && isBasicUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};

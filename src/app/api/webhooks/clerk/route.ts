import { db } from "@/lib/db";
import { Role, ROLES, users } from "@/lib/db/schemas";
import { env } from "@/lib/env.mjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;

    switch (evt.type) {
      case "user.created":
      case "user.updated":
        const user = evt.data;
        const userPrimaryEmail = user.email_addresses.filter(
          (e) => e.id === user.primary_email_address_id
        )[0].email_address!;

        const currentUserRole = user.public_metadata?.role as Role | undefined;
        const role = currentUserRole ?? ROLES.BASIC;

        const userData = {
          firstName: user.first_name,
          lastName: user.last_name,
          clerkUserId: user.id,
          email: userPrimaryEmail,
          role,
          image: user.image_url
        };

        await db.insert(users).values(userData).onConflictDoUpdate({
          target: users.clerkUserId,
          set: userData
        });

        break;

      case "user.deleted": {
        const user = evt.data;

        if (!user.id) {
          break;
        }

        await db
          .update(users)
          .set({
            deletedAt: new Date().toISOString()
          })
          .where(eq(users.clerkUserId, user.id));

        break;
      }

      default: {
        return Response.json({ received: true, message: "Unhandled event" });
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400
    });
  }
}

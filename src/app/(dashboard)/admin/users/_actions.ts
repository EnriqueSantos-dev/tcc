"use server";

import { ROLES, rolesEnum, users } from "@/lib/db/schemas";
import { authenticatedProcedure } from "@/lib/zsa";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const changeUserRoleAction = authenticatedProcedure
  .createServerAction()
  .input(
    z.object({
      userId: z.string().describe("The id of user"),
      role: z.enum(rolesEnum.enumValues)
    })
  )
  .handler(async ({ input, ctx }) => {
    try {
      const isAdmin = ctx.user.role === ROLES.ADMIN;

      if (!isAdmin) {
        throw "Apenas administradores podem alterar o papel do usuário";
      }

      const queryResult = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId));

      const user = queryResult[0];

      if (!user) {
        throw "Não foi possível encontrar o usuário";
      }

      const userRole = user.role;

      if (userRole === ROLES.ADMIN) {
        throw "Não é possível alterar o papel de administrador";
      }

      if (userRole === input.role) {
        throw "O usuário já tem esse papel";
      }

      // update the user clerk metadata
      await clerkClient().users.updateUserMetadata(user.clerkUserId, {
        publicMetadata: {
          role: input.role
        }
      });

      // update the user role in the database
      await db
        .update(users)
        .set({
          role: input.role
        })
        .where(eq(users.id, input.userId));
    } catch (error) {
      throw error;
    } finally {
      revalidatePath("/admin/users");
    }
  });

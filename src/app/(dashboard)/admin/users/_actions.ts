"use server";

import { ROLES, rolesEnum, users } from "@/lib/db/schemas";
import { authenticatedProcedure } from "@/lib/zsa";
import { clerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createUserSchema, softDeleteUserSchema } from "./validations";
import { getUser } from "@/lib/users";

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

export const createUserAction = authenticatedProcedure
  .createServerAction()
  .input(createUserSchema)
  .handler(async ({ input, ctx }) => {
    try {
      const canCrateUser = ctx.userAbilities.can("create", "Users");

      if (!canCrateUser) {
        throw "Você não tem permissão para criar usuários";
      }

      await clerkClient().users.createUser({
        emailAddress: [input.email],
        firstName: input.firstName,
        lastName: input.lastName,
        password: input.password,
        publicMetadata: {
          role: input.role
        }
      });
    } catch (error) {
      console.log("SERVER_ACTION_[createUser]_ERROR", error);
      revalidatePath("/admin/users");

      if (!isClerkAPIResponseError(error)) throw error;

      const isUniqueViolation = error.errors.some(
        (e) => e.code === "form_identifier_exists"
      );

      if (isUniqueViolation) {
        throw "Já existe um usuário com esse email";
      }

      const isPasswordPolicyViolation = error.errors.some(
        (e) => e.code === "form_password_pwned"
      );

      if (isPasswordPolicyViolation) {
        throw "Essa senha foi encontrada em uma lista de senhas vazadas. Por favor, escolha uma senha mais segura.";
      }

      throw "Ocorreu um erro desconhecido ao criar o usuário. Tente novamente.";
    }
  });

export const softDeleteUserAction = authenticatedProcedure
  .createServerAction()
  .input(softDeleteUserSchema)
  .handler(async ({ input }) => {
    try {
      // Calls Clerk to delete the user.
      // In the webhook triggered by the `user.deleted` event, we perform a soft delete in the database by setting the `deletedAt` field.
      const user = await getUser({ id: input.id });

      if (!user) {
        throw "Usuário não encontrado";
      }

      await clerkClient().users.deleteUser(user.clerkUserId);
    } catch (error) {
      console.log("SERVER_ACTION_[softDeleteUser]_ERROR", error);

      revalidatePath("/admin/users");

      throw "Ocorreu um erro ao deletar o usuário. Tente novamente.";
    }
  });

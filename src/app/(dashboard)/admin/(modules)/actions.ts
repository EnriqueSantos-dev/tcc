"use server";

import { modules } from "@/lib/db/schemas";
import { authenticatedProcedure } from "@/lib/zsa";
import { redirect } from "next/navigation";
import { createModuleSchema } from "./validation";

const procedure = authenticatedProcedure.createServerAction();

export const createModule = procedure
  .input(createModuleSchema, {
    type: "json"
  })
  .handler(async ({ input, ctx }) => {
    const { can } = ctx.userAbilities;

    if (!can("create", "Module")) {
      throw new Error("Você não tem permissão para criar módulos");
    }

    const [{ id }] = await db
      .insert(modules)
      .values({
        name: input.name,
        userId: ctx.user.id,
        description: input.description
      })
      .returning({ id: modules.id });

    redirect(`/admin/module/${id}`);
  });

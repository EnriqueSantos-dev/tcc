"use server";

import { modules } from "@/lib/db/schemas";
import { moduleSchema } from "@/lib/permissions/schemas";
import { authenticatedProcedure } from "@/lib/zsa";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { editModuleSchema } from "../validation";

const procedure = authenticatedProcedure.createServerAction();

export const editModule = procedure
  .input(editModuleSchema)
  .handler(async ({ input, ctx }) => {
    const { can } = ctx.userAbilities;

    const moduleParsed = moduleSchema.parse({
      id: input.id,
      ownerId: input.ownerId
    });

    if (!can("update", moduleParsed)) {
      throw new Error("Você não tem permissão para editar este módulo");
    }

    await db
      .update(modules)
      .set({
        name: input.name,
        description: input.description
      })
      .where(eq(modules.id, input.id));

    revalidatePath(`/module/${input.id}`);
  });

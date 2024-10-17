import { z } from "zod";

export const createModuleSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do módulo deve ter no mínimo 3 caracteres")
    .max(100, "O nome do módulo deve ter no máximo 150 caracteres"),
  description: z.string()
});

export const editModuleSchema = createModuleSchema.extend({
  id: z.string(),
  ownerId: z.string()
});

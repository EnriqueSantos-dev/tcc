import { z } from "zod";

export const editDocumentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "O nome do documento é obrigatório"),
  description: z
    .union([
      z.literal(""),
      z
        .string()
        .min(1, "A descrição precisar ter pelo menos 5 caractere")
        .max(255, "A descrição não pode ter mais de 255 caracteres")
    ])
    .default(""),
  ownerId: z.string().min(1),
  module: z.object({
    id: z.string().min(1),
    userId: z.string().min(1)
  })
});

export const createDocumentSchema = z.object({
  name: z.string().min(1, "O nome do documento é obrigatório"),
  description: z
    .union([
      z.literal(""),
      z
        .string()
        .min(1, "A descrição precisar ter pelo menos 5 caractere")
        .max(255, "A descrição não pode ter mais de 255 caracteres")
    ])
    .default(""),
  file: z.instanceof(File),
  moduleId: z.string(),
  moduleOwnerId: z.string()
});

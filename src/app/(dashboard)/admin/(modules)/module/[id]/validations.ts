import { z } from "zod";

export const editDocumentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "O nome do documento é obrigatório"),
  moduleId: z.string().min(1),
  description: z
    .union([
      z.literal(""),
      z
        .string()
        .min(1, "A descrição precisar ter pelo menos 5 caractere")
        .max(255, "A descrição não pode ter mais de 255 caracteres")
    ])
    .default("")
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
  file: z.instanceof(File, { message: "O arquivo é obrigatório" }),
  moduleId: z.string()
});

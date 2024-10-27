import { ROLES } from "@/lib/db/schemas";
import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(3, "O primeiro nome deve ter no mínimo 3 caracteres")
    .max(50, "O primeiro nome deve ter no máximo 50 caracteres"),
  lastName: z
    .string()
    .min(3, "O último nome deve ter no mínimo 3 caracteres")
    .max(50, "O último nome deve ter no máximo 50 caracteres"),
  email: z.string().email("O email deve ser válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  role: z.enum([ROLES.BASIC, ROLES.MANAGE])
});

export const softDeleteUserSchema = z.object({
  id: z.string().min(1)
});

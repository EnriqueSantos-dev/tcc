import { rolesEnum } from "@/lib/db/schemas";
import { z } from "zod";

export type { Role } from "@/lib/db/schemas";
export const rolesSchema = z.enum(rolesEnum.enumValues);

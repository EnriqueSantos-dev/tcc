import { z } from "zod";
import { rolesSchema } from "./role";

export const userSchema = z.object({
  id: z.string(),
  role: rolesSchema
});

export const userSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("get"),
    z.literal("create"),
    z.literal("delete"),
    z.literal("update")
  ]),
  z.union([
    z.literal("Users"),
    userSchema.extend({
      __typename: z.literal("Users").default("Users")
    })
  ])
]);

export type User = z.infer<typeof userSchema>;

import { z } from "zod";

export const moduleSchema = z.object({
  __typename: z.literal("Module").default("Module"),
  id: z.string(),
  ownerId: z.string()
});

export const moduleSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("get"),
    z.literal("create"),
    z.literal("delete"),
    z.literal("update")
  ]),
  z.union([z.literal("Module"), moduleSchema])
]);

export type Module = z.infer<typeof moduleSchema>;

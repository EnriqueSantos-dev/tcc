import { z } from "zod";

export const documentSchema = z.object({
  __typename: z.literal("Document").default("Document"),
  id: z.string(),
  ownerId: z.string(),
  module: z.object({
    id: z.string(),
    ownerId: z.string()
  })
});

export const documentSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("get"),
    z.literal("create"),
    z.literal("delete"),
    z.literal("update")
  ]),
  z.union([z.literal("Document"), documentSchema])
]);

export type Document = z.infer<typeof documentSchema>;
export type FlatDocument = Document & {
  "module.ownerId": Document["module"]["ownerId"];
};

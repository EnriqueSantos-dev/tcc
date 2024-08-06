import { z } from "zod";
import { MongoAbility, CreateAbility, createMongoAbility } from "@casl/ability";

import { moduleSubject } from "./module";
import { documentSubject } from "./document";

export const appAbilitiesSchema = z.union([
  moduleSubject,
  documentSubject,
  z.tuple([z.literal("manage"), z.literal("all")])
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;
export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export * from "./user";
export * from "./module";
export * from "./document";
export * from "./role";

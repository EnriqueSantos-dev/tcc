import { Module, User } from "@/lib/db/schemas";

export type ModuleWithUserAndDocumentsCount = Omit<
  Module,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "email"> | null;
  documents: string;
};

export type ModuleWithUser = Module & {
  user: Pick<User, "email"> | null;
};

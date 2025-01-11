import { Document, File, Module, Role, User } from "@/lib/db/schemas";

// Create a type for the roles
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Role;
    };
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

export type UserWithoutPassword = Omit<User, "passwordHash">;

export type OAuthProvider = "google" | "github";

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

export type NavItem = {
  icon: React.JSX.Element;
  label: string;
  href: string;
};

export type PaginationMetadata = {
  pagesCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  nextPage: number | null;
  previousPage: number | null;
};

export type PaginatedResource<T> = {
  data: T[];
  metadata: PaginationMetadata;
};

export type DocumentWithFile = Document & {
  file: File;
};

export type OptimisticEntity<T> = { isPending?: boolean } & T;

export type SimpleUser = Pick<
  User,
  "email" | "role" | "firstName" | "lastName"
>;

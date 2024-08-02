import { User } from "@/lib/db/schemas";

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

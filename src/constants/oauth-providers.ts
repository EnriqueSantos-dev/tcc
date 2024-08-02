import { OAuthProvider } from "@/types";

export const oauthProviders = {
  GOOGLE: "google",
  GITHUB: "github"
} satisfies Record<Uppercase<OAuthProvider>, OAuthProvider>;

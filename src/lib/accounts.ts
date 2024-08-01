import { and, eq } from "drizzle-orm";
import { oauthProviders } from "@/constants/oauth-providers";
import { db } from "@/lib/db";
import { oauthAccounts, users } from "@/lib/db/schemas";
import {
  GitHubUser,
  GoogleUser,
  OAuthProvider,
  UserWithoutPassword
} from "@/types";

export async function getAccountByProviderId(
  providerId: OAuthProvider,
  providerUserId: string
) {
  return await db.query.oauthAccounts.findFirst({
    where: and(
      eq(oauthAccounts.providerId, providerId),
      eq(oauthAccounts.providerUserId, providerUserId)
    ),
    with: {
      user: {
        columns: {
          id: true,
          email: true,
          image: true,
          email_verified: true,
          role: true
        }
      }
    }
  });
}

async function createAccount({
  providerId,
  providerUserId,
  userId
}: {
  providerId: string;
  providerUserId: string;
  userId: string;
}) {
  return await db.insert(oauthAccounts).values({
    providerId,
    providerUserId,
    userId
  });
}

type CreateAccountFromProviderArgs = {
  providerId: string;
  providerUserId: string;
  email: string;
  image?: string;
};

export async function createAccountFromProvider({
  providerId,
  providerUserId,
  email,
  image
}: CreateAccountFromProviderArgs) {
  const existUserWithSameEmail = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (existUserWithSameEmail) {
    await createAccount({
      providerId,
      providerUserId,
      userId: existUserWithSameEmail.id
    });

    return existUserWithSameEmail;
  }

  return await db.transaction(async (trx) => {
    const [user] = await trx
      .insert(users)
      .values({
        email,
        image
      })
      .returning();

    await trx.insert(oauthAccounts).values({
      providerId,
      providerUserId,
      userId: user.id
    });

    return {
      id: user.id,
      email_verified: false,
      image: user.image,
      role: user.role,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } satisfies UserWithoutPassword;
  });
}

export async function createUserFromGoogleProvider(
  googleUser: GoogleUser
): Promise<UserWithoutPassword> {
  return await createAccountFromProvider({
    providerId: oauthProviders.GOOGLE,
    providerUserId: googleUser.sub,
    email: googleUser.email,
    image: googleUser.picture
  });
}

export async function createUserFromGitHubProvider(githubUser: GitHubUser) {
  return await createAccountFromProvider({
    providerId: oauthProviders.GITHUB,
    providerUserId: githubUser.id,
    email: githubUser.email,
    image: githubUser.avatar_url
  });
}

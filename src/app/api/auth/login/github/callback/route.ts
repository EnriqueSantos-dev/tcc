import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { oauthProviders } from "@/constants/oauth-providers";
import {
  createUserFromGitHubProvider,
  getAccountByProviderId
} from "@/lib/accounts";
import { afterLoginUrl, github } from "@/lib/auth";
import { setSession } from "@/lib/session";
import { GitHubUser } from "@/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await getAccountByProviderId(
      oauthProviders.GITHUB,
      githubUser.id
    );

    if (existingUser) {
      await setSession(existingUser.userId);
      return new Response(null, {
        status: 302,
        headers: {
          Location: afterLoginUrl
        }
      });
    }

    if (!githubUser.email) {
      const githubUserEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`
          }
        }
      );
      const githubUserEmails = await githubUserEmailResponse.json();

      githubUser.email = getPrimaryEmail(githubUserEmails);
    }

    const user = await createUserFromGitHubProvider(githubUser);
    await setSession(user.id);
    return new Response(null, {
      status: 302,
      headers: {
        Location: afterLoginUrl
      }
    });
  } catch (e) {
    console.log("error:", e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

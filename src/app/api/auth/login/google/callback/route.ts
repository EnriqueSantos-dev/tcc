import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { oauthProviders } from "@/constants/oauth-providers";
import {
  createUserFromGoogleProvider,
  getAccountByProviderId
} from "@/lib/accounts";
import { afterLoginUrl, googleAuth } from "@/lib/auth";
import { setSession } from "@/lib/session";
import { GoogleUser } from "@/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      codeVerifier
    );
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      }
    );

    const googleUser: GoogleUser = await response.json();
    const existingUser = await getAccountByProviderId(
      oauthProviders.GOOGLE,
      googleUser.sub
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

    const user = await createUserFromGoogleProvider(googleUser);
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

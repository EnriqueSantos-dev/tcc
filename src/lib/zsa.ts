import { auth } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";
import { getUserPermissions } from "./permissions";
import { getUser } from "./users";

class InvalidSessionError extends Error {
  constructor() {
    super("A sua sessão expirou, por favor faça login novamente.");
  }
}

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    try {
      const { userId } = auth();

      if (!userId) {
        throw new InvalidSessionError();
      }

      const user = await getUser({ clerkUserId: userId });

      if (!user) throw new InvalidSessionError();

      const userAbilities = getUserPermissions(user);

      return {
        user,
        userAbilities
      };
    } catch {
      throw new InvalidSessionError();
    }
  }
);

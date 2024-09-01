import { createServerActionProcedure } from "zsa";
import { getUserPermissions } from "./permissions";
import { getCurrentUser } from "./session";

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    try {
      const user = await getCurrentUser();
      const userAbilities = getUserPermissions(user);

      return {
        user,
        userAbilities
      };
    } catch {
      throw new Error("A sua sessão expirou, por favor faça login novamente.");
    }
  }
);

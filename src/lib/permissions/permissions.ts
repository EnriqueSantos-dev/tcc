import { AbilityBuilder } from "@casl/ability";
import { AppAbility, FlatDocument, Role, User } from "./schemas";

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void;

const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can("manage", "all");
  },
  MANAGE: (user, { can }) => {
    can("get", ["Module", "Document"]);
    can<FlatDocument>("create", "Document", {
      "module.ownerId": { $eq: user.id }
    });
    can("create", "Module");
    can(["update", "delete"], ["Module", "Document"], {
      ownerId: { $eq: user.id }
    });
  },
  BASIC: (_) => {}
};

export default permissions;

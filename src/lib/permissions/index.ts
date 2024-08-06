import { AbilityBuilder } from "@casl/ability";

import { createAppAbility } from "./schemas";
import permissions from "./permissions";
import { User } from "./schemas";

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Permissions for role ${user.role} not found.`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    }
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}

export function getUserPermissions(user: User) {
  return defineAbilityFor(user);
}

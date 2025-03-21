import "server-only";

import { PaginatedResource } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { and, count, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "./db";
import { Role, User, users } from "./db/schemas";
import { getUserPermissions } from "./permissions";
import { AppAbility } from "./permissions/schemas";

type GetPaginatedUsersParams = {
  search: string | null;
  page: number;
  limit: number;
};

type GetPaginatedUsersResponse = PaginatedResource<User>;

export async function getPaginatedUsers({
  search,
  limit,
  page
}: GetPaginatedUsersParams): Promise<GetPaginatedUsersResponse> {
  const offset = (page - 1) * limit;

  const [usersData, usersCount] = await Promise.all([
    db
      .select()
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          search
            ? or(
                ilike(users.email, `%${search}%`),
                ilike(users.firstName, `%${search}%`),
                ilike(users.lastName, `%${search}%`)
              )
            : undefined
        )
      )
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt)),
    db
      .select({
        value: count()
      })
      .from(users)
      .where(isNull(users.deletedAt))
  ]);

  const pagesCount = Math.ceil(usersCount[0].value / limit);
  const hasNextPage = page < pagesCount;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  return {
    data: usersData,
    metadata: {
      pagesCount,
      hasNextPage,
      hasPreviousPage,
      page,
      nextPage,
      previousPage
    }
  };
}

export async function getUser(
  input: { id: string } | { clerkUserId: string } | { email: string }
): Promise<User | undefined> {
  const condition =
    "id" in input
      ? eq(users.id, input.id)
      : "clerkUserId" in input
        ? eq(users.clerkUserId, input.clerkUserId)
        : eq(users.email, input.email);

  const result = await db.select().from(users).where(condition);
  return result[0];
}

export async function getCurrentUser(): Promise<{
  user: User;
  userAbilities: AppAbility;
}> {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await getUser({ clerkUserId: userId });

  if (!user) redirect("/");

  return {
    user,
    userAbilities: getUserPermissions(user)
  };
}

export async function changeUserRole(
  userId: string,
  newRole: Role
): Promise<void> {
  await db
    .update(users)
    .set({
      role: newRole
    })
    .where(eq(users.id, userId));
}

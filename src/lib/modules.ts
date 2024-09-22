import "server-only";

import { db } from "@/lib/db";
import { documents, modules, users } from "@/lib/db/schemas";
import {
  ModuleWithUser,
  ModuleWithUserAndDocumentsCount,
  PaginatedResource
} from "@/types";
import { count, desc, eq, ilike, sql } from "drizzle-orm";

type GetPaginatedModulesParams = {
  search: string | null;
  page: number;
  limit: number;
};

type GetPaginatedModulesResponse =
  PaginatedResource<ModuleWithUserAndDocumentsCount>;

export async function getPaginatedModules({
  search,
  page,
  limit
}: GetPaginatedModulesParams): Promise<GetPaginatedModulesResponse> {
  const offset = (page - 1) * limit;

  const [modulesData, modulesCount] = await Promise.all([
    db
      .select({
        id: modules.id,
        name: modules.name,
        createdAt: modules.createdAt,
        updatedAt: modules.updatedAt,
        description: modules.description,
        userId: modules.userId,
        user: { email: users.email },
        documents: sql<string>`count(${documents.id})`
      })
      .from(modules)
      .leftJoin(users, eq(users.id, modules.userId))
      .leftJoin(documents, eq(documents.moduleId, modules.id))
      .where(search ? ilike(modules.name, `%${search}%`) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(modules.createdAt))
      .groupBy(({ id, user }) => [id, user.email]),

    db
      .select({
        value: count()
      })
      .from(modules)
  ]);

  const pagesCount = Math.ceil(modulesCount[0].value / limit);
  const hasNextPage = page < pagesCount;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  return {
    data: modulesData.map((module) => ({
      ...module,
      createdAt: module.createdAt!.toISOString(),
      updatedAt: module.updatedAt!.toISOString()
    })),
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

export async function getModuleById(
  id: string
): Promise<ModuleWithUser | null> {
  const moduleFromDb = await db
    .select({
      id: modules.id,
      name: modules.name,
      createdAt: modules.createdAt,
      updatedAt: modules.updatedAt,
      description: modules.description,
      userId: modules.userId,
      user: { email: users.email }
    })
    .from(modules)
    .leftJoin(users, eq(users.id, modules.userId))
    .where(eq(modules.id, id));

  return moduleFromDb[0] ?? null;
}

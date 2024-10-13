import { PaginatedResource } from "@/types";
import { count, desc, ilike } from "drizzle-orm";
import { User, users } from "./db/schemas";

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
      .where(search ? ilike(users.email, `%${search}%`) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt)),
    db
      .select({
        value: count()
      })
      .from(users)
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

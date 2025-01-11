import { DocumentWithFile, PaginatedResource } from "@/types";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { documents } from "./db/schemas";

type GetPaginatedDocumentsParams = {
  moduleId: string;
  search: string | null;
  page: number;
  limit: number;
};

type GetPaginatedDocumentsByModuleIdResponse =
  PaginatedResource<DocumentWithFile>;

export async function getPaginateDocumentsByModuleId({
  search,
  page,
  limit,
  moduleId
}: GetPaginatedDocumentsParams): Promise<GetPaginatedDocumentsByModuleIdResponse> {
  const offset = (page - 1) * limit;

  const [documentsFromDb, modulesCount] = await Promise.all([
    db.query.documents.findMany({
      with: {
        file: true
      },
      where: and(
        eq(documents.moduleId, moduleId),
        search ? ilike(documents.name, `%${search}%`) : undefined
      ),
      offset: offset,
      limit: limit,
      orderBy: desc(documents.createdAt)
    }),
    db
      .select({
        value: count()
      })
      .from(documents)
  ]);

  const pagesCount = Math.ceil(modulesCount[0].value / limit) ?? 1;
  const hasNextPage = page < pagesCount;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  const mappedDocuments = documentsFromDb.map(({ file, ...rest }) => ({
    ...rest,
    file: file!
  }));

  return {
    data: mappedDocuments,
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

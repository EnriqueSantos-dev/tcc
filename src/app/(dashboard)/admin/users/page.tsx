import { DataTablePagination } from "@/components/data-table-pagination";
import { defaultPaginationConfig } from "@/constants/pagination";
import { getCurrentUser, getPaginatedUsers } from "@/lib/users";
import { isAdminUser } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DataTable } from "./_components/data-table";

export const metadata: Metadata = {
  title: "Usuários"
};

const usersSearchParamsSchema = z.object({
  search: z.string().nullable().default(null),
  page: z.coerce.number().gt(0).catch(1),
  limit: z
    .string()
    .optional()
    .default(defaultPaginationConfig.allowedLimits[0].toString())
    .refine((value) => {
      return defaultPaginationConfig.allowedLimits.includes(parseInt(value));
    })
    .catch(defaultPaginationConfig.allowedLimits[0].toString())
});

export default async function UsersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { user } = await getCurrentUser();

  if (!isAdminUser(user)) {
    notFound();
  }

  const pageParams = usersSearchParamsSchema.parse(searchParams);

  const { data: users, metadata } = await getPaginatedUsers({
    ...pageParams,
    limit: parseInt(pageParams.limit)
  });

  // Remove the current user from the list
  const mappedUsers = users.filter((u) => u.id !== user.id);

  return (
    <div className="grid h-full grid-rows-[auto_1fr] space-y-8 p-6">
      <div className="space-y-1.5 px-2">
        <h1 className="font-bold leading-none tracking-tight">Usuários</h1>
        <h3 className="text-sm text-muted-foreground">
          Administre os usuários do sistema, crie, edite e exclua usuários.
        </h3>
      </div>
      <div className="grid grid-rows-[1fr_auto]">
        <DataTable
          canCreateUser // only admin can access this, so we can safely set this to true
          data={mappedUsers}
          pageCount={metadata.pagesCount}
        />
        <div className="justify-self-end">
          <DataTablePagination
            paginationInfo={{
              ...metadata,
              currentLimit: parseInt(pageParams.limit)
            }}
          />
        </div>
      </div>
    </div>
  );
}

import { defaultPaginationConfig } from "@/constants/pagination";
import { getPaginatedModules } from "@/lib/modules";
import { getUserPermissions } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { z } from "zod";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { DataTablePagination } from "./_components/data-table-pagination";
import DataTableToolbar from "./_components/data-table-toolbar";
import { getCurrentUser } from "@/lib/users";
import { Metadata } from "next";

const modulesSearchParamsSchema = z.object({
  search: z.string().optional(),
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

export const metadata: Metadata = {
  title: "Módulos"
};

export default async function ModulesPage(props: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const searchParams = await props.searchParams;
  const pageParams = modulesSearchParamsSchema.parse(searchParams);
  const { user, userAbilities } = await getCurrentUser();

  const canViewModules = userAbilities.can("get", "Module");
  const canCreateModules = userAbilities.can("create", "Module");

  if (!canViewModules) {
    redirect("/");
  }

  const { data, metadata } = await getPaginatedModules({
    search: pageParams.search ?? null,
    page: pageParams.page,
    limit: parseInt(pageParams.limit)
  });

  return (
    <div className="flex h-full flex-col space-y-8 p-6">
      <div className="space-y-1.5 px-2">
        <h1 className="font-bold leading-none tracking-tight">Módulos</h1>
        <h3 className="text-sm text-muted-foreground">
          Gerencie os módulos do sistema, crie, edite e exclua módulos.
        </h3>
      </div>
      <DataTableToolbar canCreateModules={canCreateModules} />
      <div className="flex h-full max-w-full flex-col">
        <div className="flex-1">
          <DataTable
            columns={columns}
            data={data}
            pageCount={pageParams.page}
          />
        </div>
        <div className="mt-4 flex justify-end">
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

import { DataTablePagination } from "@/components/data-table-pagination";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { defaultPaginationConfig } from "@/constants/pagination";
import { getPaginateDocumentsByModuleId } from "@/lib/documents";
import { getModuleById } from "@/lib/modules";
import { getUserPermissions } from "@/lib/permissions";
import { documentSchema, moduleSchema } from "@/lib/permissions/schemas";
import { DocumentWithFile } from "@/types";
import { BookOpenIcon, CalendarIcon, UserIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";
import DeleteModuleDialog from "./_components/delete-module-dialog";

import { DataTable } from "./_components/documents/data-table";
import EditModuleDialogForm from "./_components/edit-module-dialog-form";
import { DocumentDataTableColumnDto } from "./_components/documents/columns";
import { getCurrentUser } from "@/lib/users";

const moduleByIdSearchParamsSchema = z.object({
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

function getDocumentUserPermissions(
  ability: ReturnType<typeof getUserPermissions>,
  doc: DocumentWithFile & {
    moduleId: string;
    ownerModuleId: string;
  }
) {
  const documentParsed = documentSchema.parse({
    id: doc.id,
    ownerId: doc.ownerId,
    module: {
      id: doc.moduleId,
      ownerId: doc.ownerModuleId
    }
  });

  return {
    canEditDocument: ability.can("update", documentParsed),
    canDeleteDocument: ability.can("delete", documentParsed)
  };
}

export default async function ModulePageById({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const moduleId = params.id;
  const { user, userAbilities } = await getCurrentUser();
  const moduleFromDb = await getModuleById(moduleId);

  if (!moduleFromDb) notFound();

  const canEditModule = userAbilities.can(
    "update",
    moduleSchema.parse({
      id: moduleFromDb.id,
      ownerId: moduleFromDb.userId
    })
  );
  const canCreateDocument = userAbilities.can(
    "create",
    documentSchema.parse({
      id: "",
      ownerId: "",
      module: {
        id: moduleId,
        ownerId: moduleFromDb.userId
      }
    })
  );

  const pageParams = moduleByIdSearchParamsSchema.parse(searchParams);

  const { data, metadata } = await getPaginateDocumentsByModuleId({
    search: pageParams.search ?? null,
    page: pageParams.page,
    limit: parseInt(pageParams.limit),
    moduleId
  });

  const mappedDocumentsWithPermissions: DocumentDataTableColumnDto[] = data.map(
    (doc) => ({
      ...doc,
      module: {
        id: moduleId,
        userId: moduleFromDb.userId
      },
      permissions: getDocumentUserPermissions(userAbilities, {
        ...doc,
        moduleId,
        ownerModuleId: moduleFromDb.userId
      })
    })
  );

  return (
    <div className="flex h-full flex-col space-y-8 p-6">
      <Card className="max-w-3xl p-6">
        <CardHeader className="border-b p-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="inline-flex text-balance">
              <BookOpenIcon className="mr-2 size-4" />
              {moduleFromDb.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <EditModuleDialogForm
                key={moduleFromDb.id}
                canEditModule={canEditModule}
                module={{
                  id: moduleId,
                  name: moduleFromDb.name,
                  description: moduleFromDb.description ?? "",
                  ownerId: moduleFromDb.userId
                }}
              />
              <DeleteModuleDialog
                moduleId={moduleId}
                canEditModule={canEditModule}
              />
            </div>
          </div>
          {moduleFromDb.description && (
            <CardDescription className="w-4/6 text-pretty">
              {moduleFromDb.description}
            </CardDescription>
          )}
        </CardHeader>
        <div className="mt-6 flex w-fit flex-col gap-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Criado em: 01/09/2024, 10:41:19</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Atualizado em: 01/09/2024, 10:41:19</span>
            </div>
            {moduleFromDb.user && (
              <div className="flex flex-wrap items-center text-sm text-muted-foreground">
                <UserIcon className="mr-2 h-4 w-4 shrink-0" />
                <span>
                  Criado por: <b>{moduleFromDb.user.email}</b>
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
      <DataTable
        data={mappedDocumentsWithPermissions}
        pageCount={pageParams.page}
        moduleId={moduleId}
        moduleOwnerId={moduleFromDb.userId}
        canCreate={canCreateDocument}
      />
      <div className="flex justify-end">
        <DataTablePagination
          paginationInfo={{
            ...metadata,
            currentLimit: parseInt(pageParams.limit)
          }}
        />
      </div>
    </div>
  );
}

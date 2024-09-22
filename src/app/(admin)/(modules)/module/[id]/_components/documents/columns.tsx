import { Button } from "@/components/ui/button";
import { File, Module } from "@/lib/db/schemas";
import { Document } from "@/lib/db/schemas/documents";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { DataTableMeta } from "./data-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { formatFileSize } from "@/lib/utils";

export type DocumentDataTableColumnDto = Document & {
  file: File;
  module: Pick<Module, "id" | "userId">;
  permissions: {
    canEditDocument: boolean;
    canDeleteDocument: boolean;
  };
};

const columnHelper = createColumnHelper<DocumentDataTableColumnDto>();

export const columns: ColumnDef<DocumentDataTableColumnDto, any>[] = [
  columnHelper.accessor("name", {
    header: "Nome",
    maxSize: 150,
    cell: ({ row }) => {
      return (
        <Button
          asChild
          variant="link"
          className="truncate px-0 py-0 text-sm font-bold"
        >
          <Link href={`/module/${row.original.id}`}>
            {row.getValue("name")}
            <ExternalLinkIcon className="mb-0.5 ml-2 size-4" />
          </Link>
        </Button>
      );
    }
  }),
  columnHelper.accessor("description", {
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <p className="max-w-[150px] truncate text-sm">
          {row.getValue("description")}
        </p>
      );
    }
  }),

  columnHelper.accessor("file.fileName", {
    header: "Nome do arquivo",
    cell: ({ row }) => {
      return (
        <p className="max-w-[150px] truncate text-sm">
          {row.original.file.fileName}
        </p>
      );
    }
  }),
  columnHelper.accessor("file.fileSize", {
    header: "Tamanho do arquivo",
    cell: ({ row }) => {
      return (
        <p className="text-sm">{formatFileSize(row.original.file.fileSize)}</p>
      );
    }
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row, table }) => {
      return (
        <DataTableRowActions
          row={{
            id: row.original.id,
            description: row.original.description ?? "",
            name: row.original.name,
            module: {
              id: row.original.module.id,
              userId: row.original.module.userId
            },
            ownerId: row.original.ownerId,
            permissions: row.original.permissions,
            fileUrl: row.original.file.fileUrl,
            fileName: row.original.file.fileName
          }}
          onOptimisticUpdate={
            (table.options.meta as DataTableMeta).optimisticSetValue
          }
        />
      );
    }
  })
];

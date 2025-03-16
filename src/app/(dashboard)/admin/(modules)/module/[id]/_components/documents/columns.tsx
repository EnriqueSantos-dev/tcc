import { File, Module } from "@/lib/db/schemas";
import { Document } from "@/lib/db/schemas/documents";
import { formatFileSize } from "@/lib/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTableMeta } from "./data-table";
import { DataTableRowActions } from "./data-table-row-actions";

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
        <span className="truncate text-sm font-bold">
          {row.getValue("name")}
        </span>
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
          key={row.original.id}
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

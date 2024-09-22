import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Module } from "@/lib/db/schemas";
import { Document } from "@/lib/db/schemas/documents";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Action } from "./data-table";

export type DocumentDataTableColumnDto = Document & {
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
  columnHelper.accessor("createdAt", {
    header: "Criado em",
    cell: ({ row }) => {
      return (
        <p className="text-sm">
          {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "medium"
          }).format(new Date(row.getValue("createdAt")))}
        </p>
      );
    }
  }),
  columnHelper.accessor("updatedAt", {
    header: "Atualizado em",
    cell: ({ row }) => {
      return (
        <p className="text-sm">
          {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "medium"
          }).format(new Date(row.getValue("updatedAt")))}
        </p>
      );
    }
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => {
      return (
        <DataTableRowActions
          row={{
            id: props.row.original.id,
            description: props.row.original.description || "",
            name: props.row.original.name,
            module: {
              id: props.row.original.module.id,
              userId: props.row.original.module.userId
            },
            ownerId: props.row.original.ownerId,
            permissions: props.row.original.permissions
          }}
          onOptimisticUpdate={
            (
              props.table.options.meta as {
                optimisticSetValue: (action: Action) => void;
              }
            ).optimisticSetValue
          }
        />
      );
    }
  })
];

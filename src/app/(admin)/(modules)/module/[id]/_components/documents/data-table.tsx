"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { OptimisticEntity } from "@/types";
import { useOptimistic } from "react";
import DataTableToolbar from "./data-table-toolbar";
import { DocumentDataTableColumnDto, columns } from "./columns";

export const ACTION_TYPE = {
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete"
} as const;

export type ActionType = (typeof ACTION_TYPE)[keyof typeof ACTION_TYPE];

export type Action =
  | {
      type: typeof ACTION_TYPE.ADD;
      payload: Pick<DocumentDataTableColumnDto, "name" | "description">;
    }
  | {
      type: typeof ACTION_TYPE.EDIT;
      payload: {
        id: string;
        data: Partial<DocumentDataTableColumnDto>;
      };
    }
  | {
      type: typeof ACTION_TYPE.DELETE;
      payload: {
        id: string;
      };
    };

const reducer = (
  state: OptimisticEntity<DocumentDataTableColumnDto>[],
  action: Action
): DocumentDataTableColumnDto[] => {
  switch (action.type) {
    case "add":
      return [...state];
    case "edit":
      return state.map((document) =>
        document.id === action.payload.id
          ? {
              ...document,
              ...action.payload.data
            }
          : document
      );
    case "delete":
      return state.filter((document) => document.id !== action.payload.id);
    default:
      return state;
  }
};

export type DataTableMeta = {
  optimisticSetValue: (action: Action) => void;
  module: {
    id: string;
    ownerId: string;
  };
};

export interface DataTableProps {
  data: DocumentDataTableColumnDto[];
  pageCount: number;
  canCreate: boolean;
  moduleId: string;
  moduleOwnerId: string;
}

export function DataTable({
  data,
  pageCount,
  canCreate,
  moduleId,
  moduleOwnerId
}: DataTableProps) {
  const [optimisticData, optimisticSetValue] = useOptimistic(data, reducer);
  const table = useReactTable({
    manualPagination: true,
    pageCount,
    data: optimisticData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      optimisticSetValue,
      module: {
        id: moduleId,
        ownerId: moduleOwnerId
      }
    }
  });

  return (
    <div className="grid flex-1 grid-rows-[auto_1fr_auto] gap-4 pb-6">
      <DataTableToolbar canCreateDocument={canCreate} table={table} />
      <div className="h-full max-w-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import {
  ColumnDef,
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
import DataTableToolbar from "./data-table-toolbar";
import { Role, User } from "@/lib/db/schemas";
import { OptimisticEntity } from "@/types";
import { useCallback, useOptimistic } from "react";
import { columns } from "./columns";

type Action = { type: "update-role"; payload: { userId: string; role: Role } };

const reducer = (state: OptimisticEntity<User>[], action: Action) => {
  switch (action.type) {
    case "update-role":
      return state.map((user) => {
        if (user.id === action.payload.userId) {
          return { ...user, role: action.payload.role, isPending: true };
        }
        return user;
      });
    default:
      return state;
  }
};

export type DataTableMeta = {
  updateUserRole: (userId: string, role: Role) => void;
  module: {
    id: string;
    ownerId: string;
  };
};

interface DataTableProps {
  data: User[];
  pageCount: number;
}

export function DataTable({ data, pageCount }: DataTableProps) {
  const [users, dispatch] = useOptimistic(data, reducer);

  const updateUserRole = useCallback(
    (userId: string, role: Role) => {
      dispatch({ type: "update-role", payload: { userId, role } });
    },
    [dispatch]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    meta: {
      updateUserRole
    }
  });

  return (
    <div className="grid flex-1 grid-rows-[auto_1fr] gap-4 pb-6">
      <DataTableToolbar table={table} />
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

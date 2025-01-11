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
import { Role, User } from "@/lib/db/schemas";
import { SimpleUser } from "@/types";
import { useCallback, useOptimistic, useReducer } from "react";
import { columns, OptimisticUserEntity } from "./columns";
import DataTableToolbar from "./data-table-toolbar";

type Action =
  | { type: "update-role"; payload: { userId: string; role: Role } }
  | {
      type: "add";
      payload: SimpleUser;
    }
  | {
      type: "delete";
      payload: { userId: string };
    };

const reducer = (
  state: OptimisticUserEntity[],
  action: Action
): OptimisticUserEntity[] => {
  switch (action.type) {
    case "add":
      return [
        {
          id: "",
          clerkUserId: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          image: null,
          isPending: true,
          ...action.payload
        },
        ...state
      ];
    case "delete":
      return state.filter((user) => user.id !== action.payload.userId);
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
  createUser: (user: SimpleUser) => void;
  updateUserRole: (userId: string, role: Role) => void;
  deleteUser: (userId: string) => void;
  module: {
    id: string;
    ownerId: string;
  };
};

interface DataTableProps {
  data: User[];
  pageCount: number;
  canCreateUser: boolean;
}

export function DataTable({ data, pageCount, canCreateUser }: DataTableProps) {
  const [users, dispatch] = useOptimistic(data, reducer);

  const updateUserRole = useCallback(
    (userId: string, role: Role) => {
      dispatch({ type: "update-role", payload: { userId, role } });
    },
    [dispatch]
  );

  const createUser = useCallback(
    (user: SimpleUser) => {
      dispatch({ type: "add", payload: user });
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    (userId: string) => {
      dispatch({ type: "delete", payload: { userId } });
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
      updateUserRole,
      createUser,
      deleteUser
    }
  });

  return (
    <div className="grid flex-1 grid-rows-[auto_1fr] gap-4 pb-6">
      <DataTableToolbar table={table} canCreateUser={canCreateUser} />
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

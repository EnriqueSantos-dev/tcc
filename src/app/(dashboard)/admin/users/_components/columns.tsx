"use client";

import { ROLES, User } from "@/lib/db/schemas";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import ChangeUserRoleDropdown from "./change-user-role-dropdown";
import { DataTableMeta } from "./data-table";
import { OptimisticEntity } from "@/types";
import DataTableActions from "./data-table-actions";

export type OptimisticUserEntity = OptimisticEntity<User>;

const columnHelper = createColumnHelper<OptimisticUserEntity>();

export const columns: ColumnDef<OptimisticUserEntity, any>[] = [
  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.image && (
            <Image
              src={row.original.image}
              alt={`Image de perfil do usuário ${row.original.email}`}
              width={38}
              height={38}
              className="rounded-full object-cover"
            />
          )}
          <p className="text-sm">{row.getValue("email")}</p>
        </div>
      );
    }
  }),
  columnHelper.accessor("firstName", {
    header: "Nome",
    cell: ({ row }) => {
      return (
        <p className="text-sm">
          {row.original.firstName} {row.original.lastName}
        </p>
      );
    }
  }),
  columnHelper.accessor("role", {
    header: "Função (Role)",
    cell: ({ table, row }) => {
      const { role, id } = row.original;
      const tableMeta = table.options.meta as DataTableMeta;

      return (
        <ChangeUserRoleDropdown
          userId={id}
          userRole={role}
          disabled={row.original.isPending}
          roles={[ROLES.BASIC, ROLES.MANAGE]} // the app should have one user admin, so remove the admin role from the list
          onChangeRole={tableMeta.updateUserRole}
        />
      );
    }
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row, table }) => {
      const tableMeta = table.options.meta as DataTableMeta;

      return <DataTableActions tableMeta={tableMeta} row={row.original} />;
    }
  })
];

"use client";

import { ROLES, User } from "@/lib/db/schemas";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import ChangeUserRoleDropdown from "./change-user-role-dropdown";
import { DataTableMeta } from "./data-table";

type UserDataTableColumnDto = Omit<User, "hash">;

const columnHelper = createColumnHelper<UserDataTableColumnDto>();

export const columns: ColumnDef<UserDataTableColumnDto, any>[] = [
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
    header: "Role",
    cell: ({ table, row }) => {
      const { role, id } = row.original;
      const tableMeta = table.options.meta as DataTableMeta;

      return (
        <ChangeUserRoleDropdown
          userId={id}
          userRole={role}
          roles={[ROLES.BASIC, ROLES.MANAGE]} // the app should have one user admin, so remove the admin role from the list
          onChangeRole={tableMeta.updateUserRole}
        />
      );
    }
  })
];

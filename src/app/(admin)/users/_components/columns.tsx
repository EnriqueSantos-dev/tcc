"use client";

import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/db/schemas";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";

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
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ row }) => {
      return (
        <p className="max-w-[150px] truncate text-sm">{row.getValue("role")}</p>
      );
    }
  }),
  columnHelper.accessor("isEmailVerified", {
    header: "Email Verificado",
    cell: ({ row }) => {
      const isEmailVerified = row.original.isEmailVerified;

      return (
        <Badge variant={isEmailVerified ? "success" : "warning"}>
          {isEmailVerified ? "Sim" : "Não"}
        </Badge>
      );
    }
  })
];

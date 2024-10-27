import { OptimisticUserEntity } from "@/app/(dashboard)/admin/users/_components/columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import DeleteUserAlert from "./delete-user-alert";
import { Table } from "@tanstack/react-table";
import { DataTableMeta } from "./data-table";

export default function DataTableActions<TData>({
  tableMeta,
  row
}: {
  tableMeta: DataTableMeta;
  row: OptimisticUserEntity;
}) {
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);

  const handleDelete = () => {
    setIsOpenDeleteAlert(true);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <EllipsisIcon className="size-4 text-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDelete}>
            <Trash2Icon />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteUserAlert
        id={row.id}
        email={row.email}
        name={`${row.firstName} ${row.lastName}`}
        isOpen={isOpenDeleteAlert}
        setIsOpen={setIsOpenDeleteAlert}
        onRemove={tableMeta.deleteUser}
      />
    </>
  );
}

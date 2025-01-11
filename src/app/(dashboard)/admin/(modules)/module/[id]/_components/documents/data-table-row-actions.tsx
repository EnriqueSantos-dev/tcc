import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Action, ACTION_TYPE } from "./data-table";
import DeleteDocumentDialog from "./delete-document-dialog";
import EditDocumentDialog from "./edit-document-dialog";
import { Download, PencilIcon, Trash2Icon } from "lucide-react";

const rowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ownerId: z.string().min(1),
  description: z.string(),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  module: z.object({
    id: z.string().min(1),
    userId: z.string().min(1)
  }),
  permissions: z.object({
    canEditDocument: z.boolean(),
    canDeleteDocument: z.boolean()
  })
});

type RowSchema = z.infer<typeof rowSchema>;

interface DataTableRowActionsProps {
  row: RowSchema;
  onOptimisticUpdate: (action: Action) => void;
}

export function DataTableRowActions({
  row,
  onOptimisticUpdate
}: DataTableRowActionsProps) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

  const parsedRow = rowSchema.parse(row);

  const handleDocumentDelete = (documentId: string) => {
    onOptimisticUpdate({
      type: ACTION_TYPE.DELETE,
      payload: {
        id: documentId
      }
    });
  };

  const handleEditDocument = (
    payload: Pick<
      Extract<Action, { type: typeof ACTION_TYPE.EDIT }>,
      "payload"
    >["payload"]
  ) => {
    onOptimisticUpdate({
      type: ACTION_TYPE.EDIT,
      payload
    });
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsOpenEditDialog(true)}>
            <PencilIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsOpenDeleteDialog(true)}>
            <Trash2Icon />
            Deletar
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              target="_blank"
              href={parsedRow.fileUrl}
              download={parsedRow.fileName}
            >
              <Download />
              Baixar arquivo
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditDocumentDialog
        id={parsedRow.id}
        name={parsedRow.name}
        description={parsedRow.description}
        moduleId={parsedRow.module.id}
        isOpen={isOpenEditDialog}
        onOpenChange={setIsOpenEditDialog}
        canEdit={parsedRow.permissions.canEditDocument}
        onEdit={handleEditDocument}
      />
      <DeleteDocumentDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        id={parsedRow.id}
        moduleId={parsedRow.module.id}
        ownerId={parsedRow.ownerId}
        canDelete={parsedRow.permissions.canDeleteDocument}
        onDocumentDelete={handleDocumentDelete}
      />
    </>
  );
}

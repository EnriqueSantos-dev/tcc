import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { useServerAction } from "zsa-react";
import { deleteDocumentAction } from "../../actions";

export default function DeleteDocumentDialog({
  id,
  ownerId,
  moduleOwnerId,
  moduleId,
  canDelete,
  onDocumentDelete,
  isOpen,
  onOpenChange
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  ownerId: string;
  moduleId: string;
  moduleOwnerId: string;
  canDelete: boolean;
  onDocumentDelete: (documentId: string) => void;
}) {
  const [isPending, startTransaction] = useTransition();
  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && isPending) return;
    onOpenChange(isOpen);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Delete document with id: ", id);

    startTransaction(() => {
      onDocumentDelete(id);
      /* const [_, error] = await deleteDocumentAction({ id, ownerId, moduleId, moduleOwnerId });

    if (error) {
      onOpenChange(false);
      toast({
        variant: "destructive",
        title: error.message
      });
    } */
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar este documento?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita. Caso você se arrenda será
              necessário criar um novo documento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button type="submit">
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 size-5 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

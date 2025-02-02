import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon } from "lucide-react";
import { FormEvent, useTransition } from "react";
import { deleteDocumentAction } from "../../actions";

export default function DeleteDocumentDialog({
  id,
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
  canDelete: boolean;
  onDocumentDelete: (documentId: string) => void;
}) {
  const [isPending, startTransaction] = useTransition();
  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && isPending) return;
    onOpenChange(isOpen);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransaction(async () => {
      onDocumentDelete(id);
      const [_, error] = await deleteDocumentAction({
        id,
        moduleId
      });

      if (error) {
        toast({
          variant: "destructive",
          title: error.message
        });
      }

      onOpenChange(false);
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
              Esta ação não poderá ser desfeita. Caso você se arrependa será
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

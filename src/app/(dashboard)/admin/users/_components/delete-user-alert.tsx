import { AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FormEvent, useTransition } from "react";
import { softDeleteUserAction } from "../_actions";

type DeleteUserAlertProps = {
  id: string;
  name: string;
  email: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onRemove: (id: string) => void;
};

export default function DeleteUserAlert({
  id,
  email,
  name,
  isOpen,
  setIsOpen,
  onRemove
}: DeleteUserAlertProps) {
  const [isPending, startTransaction] = useTransition();

  const { toast } = useToast();

  const handleRemove = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransaction(async () => {
      onRemove(id);
      const [_, error] = await softDeleteUserAction({ id });

      if (error) {
        toast({
          title: "Ocorreu um erro ao deletar o usuário. Tente novamente.",
          variant: "destructive"
        });
      }

      setIsOpen(false);
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <form onSubmit={handleRemove}>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar usuário</AlertDialogTitle>
            <AlertDescription>
              Você tem certeza que deseja deletar o usuário{" "}
              <strong>{name}</strong> (<strong>{email}</strong>) ?
            </AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <Button type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

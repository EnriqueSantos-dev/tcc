import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { editDocumentAction } from "../../actions";
import { editDocumentSchema } from "../../validations";
import { Action, ACTION_TYPE } from "./data-table";
import { useTransition } from "react";

export default function EditDocumentDialog({
  id,
  name,
  description,
  ownerId,
  moduleOwnerId,
  moduleId,
  canEdit,
  onEdit,
  isOpen,
  onOpenChange
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  moduleId: string;
  moduleOwnerId: string;
  canEdit: boolean;
  onEdit: (
    payload: Pick<
      Extract<Action, { type: typeof ACTION_TYPE.EDIT }>,
      "payload"
    >["payload"]
  ) => void;
}) {
  const [isPending, startTransaction] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editDocumentSchema>>({
    defaultValues: {
      id,
      description: description ?? "",
      name,
      ownerId,
      module: {
        id: moduleId,
        userId: moduleOwnerId
      }
    },
    resolver: zodResolver(editDocumentSchema)
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && isPending) return;
    if (!isOpen) form.reset();
    onOpenChange(isOpen);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    startTransaction(async () => {
      onEdit({ id, data: values });
      const [_, error] = await editDocumentAction(values);

      if (error) {
        toast({
          title: error.message,
          variant: "destructive"
        });
        form.reset();
        onOpenChange(false);
        return;
      }

      toast({
        title: "O documento foi editado com sucesso.",
        variant: "success"
      });

      form.reset();
      onOpenChange(false);
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar documento</DialogTitle>
          <DialogDescription>
            Editando o documento &ldquo;{name}&ldquo;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="space-y-4 pb-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Ex: Documento de matrícula"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="max-h-20 resize-none"
                        placeholder="Ex: Documento que contém tutoriais para criação de matrícula."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending || !canEdit}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

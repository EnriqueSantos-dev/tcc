"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { createDocumentAction } from "../../actions";
import { createDocumentSchema } from "../../validations";
import FileUpload from "./file-upload";
import { Loader2 } from "lucide-react";

type CreateDocumentDialogProps = {
  canCreate: boolean;
  onOptimisticCreate: (data: {
    name: string;
    description?: string;
    file?: File;
  }) => void;
  moduleId: string;
  moduleOwnerId: string;
};

type FormValues = z.infer<typeof createDocumentSchema>;

export default function CreateDocumentDialog({
  canCreate,
  moduleId,
  moduleOwnerId
}: CreateDocumentDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();
  const { isPending, execute } = useServerAction(createDocumentAction);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      moduleId,
      moduleOwnerId
    },
    resolver: zodResolver(createDocumentSchema)
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
        file: undefined
      });
    }
    setIsOpen(isOpen);
  };

  const onSubmit = form.handleSubmit(async (values, event) => {
    const formElement = event?.target;
    const formData = new FormData(formElement);
    // override the file value because when use drag and drop the file type is setted to application/octet-stream
    // i'm not sure if this is a bug or not, but this is a workaround
    formData.set("file", values.file);

    const [_, error] = await execute(formData);

    if (error && !error.formErrors) {
      toast({
        title: error.message,
        variant: "destructive"
      });
      return;
    }

    form.reset({
      file: undefined
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={!canCreate}>
        <Button>Criar documento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar documento</DialogTitle>
          <DialogDescription>
            Selecione um arquivo para criar um novo documento
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
            <input {...form.register("moduleId")} hidden />
            <input {...form.register("moduleOwnerId")} hidden />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
                      placeholder="Ex: Documento que contém tutoriais para criação de matrícula."
                      className="max-h-20 resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    💡 Dica: Adicione uma descrição que ajude a identificar o
                    documento entre os demais.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      maxFiles={1}
                      maxSize={30 * 1024 * 1024} // 30MB,
                      accept={{
                        "application/pdf": [".pdf"],
                        "text/plain": [".txt"]
                      }}
                      helperTextDescription="Adicione um arquivo no formato PDF ou txt."
                      onRemoveFile={() => field.onChange(undefined)}
                      onDrop={(acceptedFiles) => {
                        field.onChange(acceptedFiles[0]);
                      }}
                      onDropRejected={() => {
                        toast({
                          variant: "destructive",
                          title:
                            "Arquivo inválido. Por favor adicione um arquivo no formato PDF ou txt. O tamanho máximo é de 30MB."
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar documento"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

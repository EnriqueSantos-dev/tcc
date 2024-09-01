import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserPermissions } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/session";
import {
  BookOpenIcon,
  Calendar,
  PencilIcon,
  TimerIcon,
  Trash2Icon,
  UserIcon
} from "lucide-react";
import { notFound } from "next/navigation";
import { getModuleById } from "../../_lib/modules";
import DeleteModuleDialog from "./_components/delete-module-dialog";
import EditModuleDialogForm from "./_components/edit-module-dialog-form";

export default async function ModulePageById({
  params
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const moduleFromDb = await getModuleById(params.id);

  if (!moduleFromDb) notFound();

  const userAbilities = getUserPermissions(user);
  const canEditModule = userAbilities.can("update", {
    __typename: "Module",
    id: moduleFromDb.id,
    ownerId: moduleFromDb.userId
  });

  return (
    <div className="flex h-full flex-col space-y-8 p-6">
      <Card className="max-w-3xl p-6">
        <CardHeader className="mb-6 p-0">
          <div className="flex items-center justify-between">
            <CardTitle className="inline-flex">
              <BookOpenIcon className="mr-2 size-4" />
              {moduleFromDb.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <EditModuleDialogForm
                canEditModule={canEditModule}
                module={{
                  id: params.id,
                  name: moduleFromDb.name,
                  description: moduleFromDb.description ?? "",
                  ownerId: moduleFromDb.userId
                }}
              />
              <DeleteModuleDialog />
            </div>
          </div>
          <CardDescription>{moduleFromDb.description}</CardDescription>
        </CardHeader>
        <div className="flex w-fit flex-col gap-2">
          <Badge variant="outline">
            <Calendar className="mr-2 size-4" />
            Criado em: {moduleFromDb.createdAt?.toLocaleString()}
          </Badge>
          <Badge variant="outline">
            <TimerIcon className="mr-2 size-4" />
            Atualizado em: {moduleFromDb.updatedAt?.toLocaleString()}
          </Badge>
          {moduleFromDb.user && (
            <Badge variant="outline">
              <UserIcon className="mr-2 size-4" />
              Criado por: {moduleFromDb.user.email}
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
}

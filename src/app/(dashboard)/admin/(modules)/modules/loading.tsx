import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function loading() {
  return (
    <div className="grid h-full grid-rows-[repeat(2,auto)_1fr] gap-8 p-6">
      <div className="space-y-1.5 px-2">
        <h1 className="font-bold leading-none tracking-tight">Módulos</h1>
        <h3 className="text-sm text-muted-foreground">
          Gerencie os módulos do sistema, crie, edite e exclua módulos.
        </h3>
      </div>
      <div className="flex items-stretch gap-2">
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid h-full grid-rows-[1fr_auto]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead># Documentos</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Atualizado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-36" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end gap-6">
          <Skeleton className="h-9 w-36" />
          <div className="flex items-center gap-2 *:w-14">
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </div>
        </div>
      </div>
    </div>
  );
}

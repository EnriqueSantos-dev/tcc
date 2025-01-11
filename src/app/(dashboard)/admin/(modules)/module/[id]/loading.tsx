import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { BookOpenIcon, CalendarIcon, UserIcon } from "lucide-react";

export default function ModulePageSkeleton() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] space-y-8 p-6">
      <Card className="max-w-3xl p-6">
        <CardHeader className="border-b p-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="inline-flex text-balance">
              <BookOpenIcon className="mr-1 size-4" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          <CardDescription className="w-4/6 text-pretty">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </CardDescription>
        </CardHeader>
        <div className="mt-6 flex w-fit flex-col gap-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground">
              <UserIcon className="mr-2 h-4 w-4 shrink-0" />
              <Skeleton className="h-3 w-60" />
            </div>
          </div>
        </div>
      </Card>
      <div className="grid grid-rows-[auto_1fr] space-y-4">
        <div className="grid h-10 max-w-3xl grid-cols-[1fr_20%_20%] gap-2 *:h-full">
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </div>
        <Skeleton className="w-full" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}

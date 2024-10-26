"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { defaultPaginationConfig } from "@/constants/pagination";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { PaginationMetadata } from "@/types";

interface DataTablePaginationProps<TData> {
  paginationInfo: PaginationMetadata & { currentLimit: number };
}

export function DataTablePagination<TData>({
  paginationInfo
}: DataTablePaginationProps<TData>) {
  const { queryParams } = useRouterStuff();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${paginationInfo.currentLimit}`}
            onValueChange={(value) => {
              queryParams({
                set: {
                  limit: value
                }
              });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent side="top">
              {defaultPaginationConfig.allowedLimits.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {paginationInfo.page} de {paginationInfo.pagesCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              queryParams({
                set: {
                  page: "1"
                }
              });
            }}
            disabled={!paginationInfo.hasPreviousPage}
          >
            <span className="sr-only">Ir para primeira página</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              queryParams({
                set: {
                  page: `${paginationInfo.previousPage}`
                }
              });
            }}
            disabled={!paginationInfo.hasPreviousPage}
          >
            <span className="sr-only">Próxima anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              queryParams({
                set: {
                  page: `${paginationInfo.nextPage}`
                }
              });
            }}
            disabled={!paginationInfo.hasNextPage}
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              queryParams({
                set: {
                  page: `${paginationInfo.pagesCount}`
                }
              });
            }}
            disabled={!paginationInfo.hasNextPage}
          >
            <span className="sr-only">Última página</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

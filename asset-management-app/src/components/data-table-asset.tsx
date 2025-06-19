"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
  RowData,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {IconChevronUp } from '@tabler/icons-react';
import Link from "next/link"
import { deleteAsset, DeleteConfirmationDialog } from "./delete-confirmation"
import { ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"

declare module '@tanstack/react-table' {
  
  interface TableMeta<TData extends RowData> {
    setData: React.Dispatch<React.SetStateAction<TData[]>>
  }
}

export const schema = z.object({
  asset_id: z.string(),
  asset_name: z.string(),
  category: z.string(),
  status: z.string(),
  location: z.string(),
  created_date: z.string(),
  updated_at: z.string(),
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Jakarta',
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => (
      <div className="text-center">{row.index + 1}</div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "asset_name",
    header: "Asset Name",
    cell: ({ row }) => (
      <div className="text-center">{row.original.asset_name}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "asset_id",
    header: "Asset ID",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline" className="text-center text-muted-foreground px-1.5">
          {row.original.asset_id}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "asset_category",
    header: "Category",
    cell: ({ row }) => (
      <div className="text-center">{row.original.category}</div>
    ),
  },
  {
    accessorKey: "asset_status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-center">
          <Badge variant="outline" className="justify-center px-1.5">
          {row.original.status === "Deployed" ? (
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : row.original.status === "Undeployed" ? (
              <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
              
          ) 
          : (
              <IconLoader />
          )}
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "asset_location",
    header: "Location",
    cell: ({ row }) => (
        <div className="text-center ">{row.original.location}</div>
    ),
  },
  {
    accessorKey: "asset_created",
    header: "Created Date",
    cell: ({ row }) => {
      const date = new Date(row.original.created_date);
      const formattedDateTime = `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
      return <div className="text-center">{formattedDateTime}</div>;
    },
  },
  {
    accessorKey: "asset_updated",
    header: "Update At",
    cell: ({ row }) => {
        const date = new Date(row.original.updated_at);
        const formattedDateTime = `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
        return <div className="text-center">{formattedDateTime}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => { 
      const { setData } = table.options.meta;
      const handleDelete = async () => {
        try {
          await deleteAsset(row.original.asset_id);
          setData((currentData: any[]) => 
            currentData.filter(item => item.asset_id !== row.original.asset_id)
          );
          toast.success(`Aset "${row.original.asset_name}" dengan ID "${row.original.asset_id}" berhasil dihapus.`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
          console.error("Gagal menghapus aset dari tabel:", error);
          toast.error("Gagal Menghapus Aset", {
            description: errorMessage,
          });
        }
      };
      return(
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
              >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>
              <Link href={`/asset/detail_asset/${row.original.asset_id}`}>
                View Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/asset/update_asset/${row.original.asset_id}`}>
                  Update
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DeleteConfirmationDialog onConfirm={handleDelete}>
              <DropdownMenuItem className="cursor-pointer" variant="destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
            </DeleteConfirmationDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.asset_id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ asset_id }) => asset_id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    meta:{
      setData,
    },
    getRowId: (row) => row.asset_id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6 pb-4">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <div className="flex w-fit"></div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown className="ml-2 h-4 w-4" /> 
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/_/g, " ")}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/asset/add_asset">
            <Button size="sm">
              <IconPlus /> <span className="hidden lg:inline">Add Asset</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <Button
                              variant="ghost" 
                              onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                              className="w-full justify-center items-center p-0 h-auto" 
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() === "asc" && <IconChevronUp className="ml-2 h-4 w-4" />}
                              {header.column.getIsSorted() === "desc" && <IconChevronDown className="ml-2 h-4 w-4" />}
                              {!header.column.getIsSorted() && header.column.getCanSort() && (
                                <ChevronsUpDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[20, 40, 60, 80, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


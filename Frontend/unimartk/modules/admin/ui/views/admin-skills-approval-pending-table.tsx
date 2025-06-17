"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminSkills } from "../../api";
import { Product } from "@/modules/products/types";
import ErrorPage from "@/app/(admin)/admin/error";
import LoadingPage from "@/app/(admin)/admin/loader";
import { Category } from "@/modules/home/types";
import {
  Degree,
  DepartmentOrRoleOrSkillCategory,
  Skill,
} from "@/modules/skills/types";

export const columns: ColumnDef<Skill>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "module",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Module <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "charge_per_hour",
    header: "Charge Per Hour",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("charge_per_hour")}</div>
    ),
  },
  {
    accessorKey: "skill_category",
    header: "Category",

    cell: ({ row }) => (
      <div className="lowercase">
        {(row.getValue("skill_category") as Category).name}
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      return (
        <div className="lowercase max-w-40 overflow-hidden text-ellipsis">
          {(row.getValue("department") as DepartmentOrRoleOrSkillCategory).name}
        </div>
      );
    },
  },
  {
    accessorKey: "degree",
    header: "Degree",
    cell: ({ row }) => {
      return (
        <div className="lowercase max-w-40 overflow-hidden text-ellipsis">
          {(row.getValue("degree") as Degree).name}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "px-2 uppercase",
          row.getValue("status") === "pending" &&
            "bg-orange-200 border-orange-500 text-orange-600",
          row.getValue("status") === "rejected" &&
            "bg-red-200 border-red-500 text-red-600"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.getValue("status") !== "rejected" && (
              <DropdownMenuItem onClick={() => alert(`Approved listing `)}>
                Reject Listing
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => alert(`Rejected Listing `)}>
              Approve Listing
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert(`Delete `)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ApproveSkillsTable = () => {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminSkills"],
    queryFn: fetchAdminSkills,
  });

  const unapprovedSkills = React.useMemo(() => {
    return data?.filter((skill: Skill) => skill.status !== "approved");
  }, [data]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: unapprovedSkills,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="w-full px-4 lg:px-12 py-8 flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <div
          className="p-3 hover:bg-gray-200 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="" />
        </div>
        <p className="text-3xl font-semibold">Skills Approval</p>
      </div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter module..."
          value={(table.getColumn("module")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("module")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex flex-row gap-4">
          {/* {table.getSelectedRowModel().rows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="">
                  Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => {
                    const selected = table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original);
                    console.log("Approving selected:", selected);
                    // call your approve API here
                  }}
                >
                  Approve Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const selected = table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original);
                    console.log("Rejecting selected:", selected);
                    // call your reject API here
                  }}
                >
                  Reject Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const selected = table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original);
                    console.log("Deleting selected:", selected);
                    // call your delete API here
                  }}
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getPaginationRowModel().rows?.length ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApproveSkillsTable;

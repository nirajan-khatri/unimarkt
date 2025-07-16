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
import { cn, sendAdminMessage } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveSkill, deleteSkill, fetchAdminSkills } from "../../api";
import ErrorPage from "@/app/(admin)/admin/error";
import LoadingPage from "@/app/(admin)/admin/loader";
import { Category } from "@/modules/home/types";
import {
  Degree,
  DepartmentOrRoleOrSkillCategory,
  Skill,
} from "@/modules/skills/types";
import CommentDialog from "../components/comment-dialog";
import Link from "next/link";
import { User } from "../../types";

const SkillsTable = () => {
  const router = useRouter();
  const [dialogType, setDialogType] = React.useState<
    "reject" | "delete" | null
  >(null);
  const [selectedSkillId, setSelectedSkillId] = React.useState<string | null>(
    null
  );
  const [comment, setComment] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminSkills"],
    queryFn: fetchAdminSkills,
  });

  const queryClient = useQueryClient();

  const approveSkillMutation = useMutation({
    mutationFn: approveSkill,
    onSuccess: () => {
      // refetch products after approval
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
    },
  });

  const rejectSkillMutation = useMutation({
    mutationFn: async ({
      skillId,
      comment,
    }: {
      skillId: string;
      comment: string;
    }) => {
      const userId = data.filter(
        (skill: Skill) => skill.skill_id === selectedSkillId
      )[0].user.id;
      approveSkill({ skillId, data: { status: "rejected" } });
      await sendAdminMessage(
        userId,
        comment,
        data.filter((skill: Skill) => skill.skill_id === selectedSkillId)[0]
          .module,
        "rejected"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      setDialogOpen(false);
      setComment("");
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async ({
      skillId,
      comment,
    }: {
      skillId: string;
      comment: string;
    }) => {
      const userId = data.filter(
        (skill: Skill) => skill.skill_id === selectedSkillId
      )[0].user.id;
      deleteSkill(skillId);
      await sendAdminMessage(
        userId,
        comment,
        data.filter((skill: Skill) => skill.skill_id === selectedSkillId)[0]
          .module,
        "deleted"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      setDialogOpen(false);
      setComment("");
    },
  });

  const columns: ColumnDef<Skill>[] = [
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
      cell: ({ row }) => (
        <Link href={`/admin/skills/${row.original.skill_id}`}>
          <span className="font-medium">{row.getValue("module")}</span>
        </Link>
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
            {
              (row.getValue("department") as DepartmentOrRoleOrSkillCategory)
                .name
            }
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
      accessorKey: "user",
      header: "Posted By",
      cell: ({ row }) => {
        return (
          <div className="lowercase">
            {(row.getValue("user") as User)?.name}
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
            (row.getValue("status") as string).toLowerCase() === "pending" &&
              "bg-orange-200 border-orange-500 text-orange-600",
            (row.getValue("status") as string).toLowerCase() === "rejected" &&
              "bg-red-200 border-red-500 text-red-600",
            (row.getValue("status") as string).toLowerCase() === "approved" &&
              "bg-green-200 border-green-500 text-green-600"
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
                <DropdownMenuItem
                  onClick={() => {
                    setDialogType("reject");
                    setSelectedSkillId(row.original.skill_id);
                    setDialogOpen(true);
                  }}
                >
                  Reject Skill
                </DropdownMenuItem>
              )}

              {row.getValue("status") !== "approved" && (
                <DropdownMenuItem
                  onClick={() => {
                    approveSkillMutation.mutate({
                      skillId: row.original.skill_id,
                      data: { status: "approved" },
                    });
                  }}
                >
                  Approve Skill
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setDialogType("delete");
                  setSelectedSkillId(row.original.skill_id);
                  setDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
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
        <p className="text-3xl font-semibold">Skills</p>
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
              <Button variant="outline" className="ml-auto border-border">
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
      <div className="rounded-md border bg-white/10 border-border">
        <Table className="border-border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border">
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
                  className="border-border"
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
            className="border-border"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="border-border"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <CommentDialog
        listingType="skill"
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogType={dialogType}
        selectedId={selectedSkillId}
        comment={comment}
        setComment={setComment}
        rejectMutation={rejectSkillMutation}
        deleteMutation={deleteSkillMutation}
      />
    </div>
  );
};

export default SkillsTable;

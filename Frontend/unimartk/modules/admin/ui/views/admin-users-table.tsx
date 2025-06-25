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
  DropdownMenuLabel,
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
import { approveUser, deleteUser, fetchAdminUsers } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../../types";
import LoadingPage from "@/app/(admin)/admin/loader";
import ErrorPage from "@/app/(admin)/admin/error";
import { UserRole } from "@/modules/auth/types/auth";
import ConfirmDialog from "@/components/confirm-dialog";

const UsersTable = () => {
  const router = useRouter();
  const isSuperadmin = false;
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogData, setDialogData] = React.useState<{
    title: string;
    subtitle: string;
    buttonType: "default" | "destructive" | "secondary";
    mutation: any;
    type: "delete" | "revoke" | "make";
  }>({
    title: "",
    subtitle: "",
    buttonType: "default",
    mutation: undefined,
    type: "make",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchAdminUsers,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const filterSuperAdmin = React.useMemo(() => {
    if (isSuperadmin) return data;
    return data?.filter((user: User) => user.role?.name !== "superuser");
  }, [data]);

  const queryClient = useQueryClient();

  const makeUserUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      approveUser({ userId, data: { status: "approved", role_id: "1" } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setDialogOpen(false);
    },
  });

  const makeUserAdminMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      approveUser({ userId, data: { status: "approved", role_id: "3" } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setDialogOpen(false);
    },
  });

  const makeUserFacultyMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      approveUser({ userId, data: { status: "approved", role_id: "2" } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setDialogOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setDialogOpen(false);
    },
  });

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Active",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "px-2 uppercase",
            row.getValue("is_active") === true
              ? "bg-emerald-200 border-emerald-500 text-emerald-600"
              : "bg-orange-200 border-orange-500 text-orange-600"
          )}
        >
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={"outline"} className={cn("px-2 uppercase")}>
          {(row.getValue("role") as UserRole)?.name ?? "user"}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        const isFaculty = user.role?.name === "faculty";
        const isAdmin = user.role?.name === "admin";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => {
                    setDialogData({
                      mutation: makeUserUserMutation,
                      buttonType: "destructive",
                      title: "Remove admin",
                      subtitle: "Removing the admin previlages for this user",
                      type: "revoke",
                    });
                    setSelectedUserId(row.original.id);
                    setDialogOpen(true);
                  }}
                >
                  Remove Admin
                </DropdownMenuItem>
              )}
              {!isAdmin && (
                <DropdownMenuItem
                  onClick={() => {
                    setDialogData({
                      mutation: makeUserAdminMutation,
                      buttonType: "default",
                      title: "Make admin",
                      subtitle: "Giving admin previlages for this user",
                      type: "make",
                    });
                    setSelectedUserId(row.original.id);
                    setDialogOpen(true);
                  }}
                >
                  Make Admin
                </DropdownMenuItem>
              )}
              {!isFaculty && (
                <DropdownMenuItem
                  onClick={() => {
                    setDialogData({
                      mutation: makeUserFacultyMutation,
                      buttonType: "default",
                      title: "Make faculty",
                      subtitle: "Giving faculty previlages for this user",
                      type: "make",
                    });
                    setSelectedUserId(row.original.id);
                    setDialogOpen(true);
                  }}
                >
                  Make Faculty
                </DropdownMenuItem>
              )}

              {isFaculty && (
                <DropdownMenuItem
                  onClick={() => {
                    setDialogData({
                      mutation: makeUserUserMutation,
                      buttonType: "destructive",
                      title: "Remove faculty",
                      subtitle: "Removing the faculty previlages for this user",
                      type: "revoke",
                    });
                    setSelectedUserId(row.original.id);
                    setDialogOpen(true);
                  }}
                >
                  Remove Faculty
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDialogData({
                    title: `Delete ${row.getValue("name")}'s Account?`,
                    subtitle: `This action will permanently remove the user's account and all associated data. This operation cannot be undone.`,
                    type: "delete",
                    buttonType: "destructive",
                    mutation: deleteUserMutation,
                  });
                  setSelectedUserId(row.original.id);
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

  const table = useReactTable({
    data: filterSuperAdmin,
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
        <p className="text-3xl font-semibold">Users</p>
      </div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex flex-row gap-4">
          {table.getSelectedRowModel().rows.length > 0 && (
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
          )}
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
      <div className="rounded-md border">
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
      <ConfirmDialog
        buttonType={dialogData.buttonType}
        dialogOpen={dialogOpen}
        mutation={dialogData.mutation}
        selectedId={selectedUserId}
        setDialogOpen={setDialogOpen}
        title={dialogData.title}
        type={dialogData.type}
        listingType="user"
        subtitle={dialogData.subtitle}
      />
    </div>
  );
};

export default UsersTable;

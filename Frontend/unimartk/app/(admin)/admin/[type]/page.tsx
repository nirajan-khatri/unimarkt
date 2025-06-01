import AdminApprovalTable from "@/modules/admin/ui/views/admin-admins-table";
import FacultyApprovalTable from "@/modules/admin/ui/views/admin-faculty-table";
import ProductApprovalTable from "@/modules/admin/ui/views/admin-products-pending-table";
import React from "react";

interface Props {
  params: Promise<{
    type: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { type } = await params;

  return (
    <div className="max-w-7xl mx-auto mt-10">
      {type === "faculty" ? (
        <FacultyApprovalTable />
      ) : type === "admin" ? (
        <AdminApprovalTable />
      ) : (
        <ProductApprovalTable />
      )}
    </div>
  );
};

export default Page;

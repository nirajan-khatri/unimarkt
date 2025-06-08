import AdminApprovalTable from "@/modules/admin/ui/views/admin-admins-table";
import FacultyApprovalTable from "@/modules/admin/ui/views/admin-faculty-table";
import ProductTable from "@/modules/admin/ui/views/admin-products-table";

import React from "react";

interface Props {
  params: Promise<{
    type: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { type } = await params;

  return (
    <div className="">
      {type === "faculty" ? (
        <FacultyApprovalTable />
      ) : type === "admins" ? (
        <AdminApprovalTable />
      ) : (
        <ProductTable />
      )}
    </div>
  );
};

export default Page;

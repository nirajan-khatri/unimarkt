import AdminApprovalTable from "@/modules/admin/ui/views/admin-admins-table";
import ApproveSkillsTable from "@/modules/admin/ui/views/admin-skills-approval-pending-table";
import FacultyApprovalTable from "@/modules/admin/ui/views/admin-faculty-table";
import ProductTable from "@/modules/admin/ui/views/admin-products-table";

import UsersTable from "@/modules/admin/ui/views/admin-users-table";

import React from "react";
import ApproveProductTable from "@/modules/admin/ui/views/admin-product-approval-pending-table";
import SkillsTable from "@/modules/admin/ui/views/admin-skills-table";
import JobsTable from "@/modules/admin/ui/views/admin-jobs-table";
import ApproveJobsTable from "@/modules/admin/ui/views/admin-jobs-approval-pending-table";

interface Props {
  params: Promise<{
    type: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { type } = await params;

  return (
    <div className="">
      {type === "faculty" && <FacultyApprovalTable />}
      {type === "admins" && <AdminApprovalTable />}
      {type === "products" && <ProductTable />}
      {type === "skills" && <SkillsTable />}
      {type === "jobs" && <JobsTable />}
      {type === "productsApprovals" && <ApproveProductTable />}
      {type === "skillsApprovals" && <ApproveSkillsTable />}
      {type === "jobsApprovals" && <ApproveJobsTable />}
      {type === "users" && <UsersTable />}
    </div>
  );
};

export default Page;

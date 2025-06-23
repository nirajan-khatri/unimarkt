"use client";

import { users } from "@/constants/users";
import AdminCard from "@/modules/admin/ui/components/admin-card";
import React, { useMemo } from "react";
import { fetchDashboardStats } from "../../api";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "@/app/(admin)/admin/loader";
import ErrorPage from "@/app/(admin)/admin/error";

const AdminDashboardView = () => {
  const isSuperuser = true;

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-12 py-8">
      <p className="text-3xl font-semibold">
        {isSuperuser ? "SuperAdmin" : "Admin"} Dashboard
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <AdminCard
          title="Products Listed"
          value={data?.totalProducts ?? 0}
          subtitle={`${data?.totalApprovedProducts ?? 0} approved, ${data?.totalRejectedProducts ?? 0} rejected, ${data?.totalPendingProducts ?? 0} pending`}
          href={"/admin/products"}
        />
        <AdminCard
          title="Skills Listed"
          value={data?.totalSkills ?? 0}
          subtitle={`${data?.totalApprovedSkills ?? 0} approved, ${data?.totalRejectedSkills ?? 0} rejected, ${data?.totalPendingSkills ?? 0} pending`}
          href={"/admin/skills"}
        />
        <AdminCard
          title="Jobs Listed"
          value={data?.totalProducts ?? 0}
          subtitle={`${data?.totalApprovedProducts ?? 0} approved, ${data?.totalRejectedProducts ?? 0} rejected, ${data?.totalPendingProducts ?? 0} pending`}
          href={"/admin/jobs"}
        />
        <AdminCard
          title="Users"
          value={
            isSuperuser
              ? (data?.totalUsersWithSuperUser ?? 0)
              : (data?.totalUsersWithoutSuperUser ?? 0)
          }
          subtitle={Object.entries(data?.roleCounts || {})
            .filter(([role]) => isSuperuser || role !== "superuser")
            .map(([role, count]) => `${count} ${role}`)
            .join(", ")}
          href="/admin/users"
        />
        <AdminCard
          title="Products Approval Pending"
          subtitle={`${data?.totalRejectedProducts ?? 0} rejected, ${data?.totalPendingProducts ?? 0} pending`}
          value={data?.totalUnapprovedProducts ?? 0}
          href="/admin/productsApprovals"
        />
        <AdminCard
          title="Skills Approval Pending"
          subtitle={`${data?.totalRejectedSkills ?? 0} rejected, ${data?.totalPendingSkills ?? 0} pending`}
          value={data?.totalUnapprovedSkills ?? 0}
          href={"/admin/skillsApprovals"}
        />
        <AdminCard
          title="Jobs Approval Pending"
          subtitle={`${data?.totalRejectedProducts ?? 0} rejected, ${data?.totalPendingProducts ?? 0} pending`}
          value={data?.totalUnapprovedProducts ?? 0}
          href="/admin/jobsApprovals"
        />

        <AdminCard
          title="Admins"
          subtitle={`${data?.totalRejectedAdmins ?? 0} rejected, ${data?.totalPendingAdmins ?? 0} pending`}
          value={data?.totalUnapprovedAdmins ?? 0}
          href="/admin/admins"
        />
        <AdminCard
          title="Faculty"
          subtitle={`${data?.totalRejectedFaculty ?? 0} rejected, ${data?.totalPendingFaculty ?? 0} pending`}
          value={data?.totalUnapprovedFaculty ?? 0}
          href="/admin/faculty"
        />
      </div>
    </div>
  );
};

export default AdminDashboardView;

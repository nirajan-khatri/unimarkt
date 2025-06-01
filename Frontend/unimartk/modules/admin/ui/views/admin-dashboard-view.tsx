"use client";

import { users } from "@/constants/users";
import AdminCard from "@/modules/admin/ui/components/admin-card";
import React, { useMemo } from "react";

const AdminDashboardView = () => {
  const isSuperAdmin = true;

  // calculate approved and unapproved for admin and faculty
  const summaryData = useMemo(() => {
    const approvedAdmins = users.filter((user) =>
      user.approvedRoles.includes("admin")
    ).length;
    const approvedFaculty = users.filter((user) =>
      user.approvedRoles.includes("faculty")
    ).length;
    const unapprovedAdmins = users.filter((user) =>
      user.requestedRoles.includes("admin")
    ).length;
    const unapprovedFaculty = users.filter((user) =>
      user.requestedRoles.includes("faculty")
    ).length;
    const activeUsers = users.length;

    return {
      approvedAdmins,
      approvedFaculty,
      unapprovedAdmins,
      unapprovedFaculty,
      activeUsers,
    };
  }, [users]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-3xl font-semibold">
        {isSuperAdmin ? "SuperAdmin" : "Admin"} Dashboard
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard title="Products Listed" value={20} />
        <AdminCard
          title="Skills Listed"
          value={12}
          onClick={() => alert("Clicked Skills")}
        />
        <AdminCard title="Active Users" value={summaryData.activeUsers} />
        {!isSuperAdmin && (
          <AdminCard
            title="Approval Pending"
            value={8}
            href="/admin/approvals"
          />
        )}
        {isSuperAdmin && (
          <>
            <AdminCard
              title="Approval Pending"
              value={2}
              href="/admin/products"
            />
            <AdminCard
              title="Admins"
              subtitle={`${summaryData.approvedAdmins} approved, ${summaryData.unapprovedAdmins} unapproved`}
              value={summaryData.approvedAdmins + summaryData.unapprovedAdmins}
              href="/admin/admins"
            />
            <AdminCard
              title="Faculty"
              subtitle={`${summaryData.approvedFaculty} approved, ${summaryData.unapprovedFaculty} unapproved`}
              value={
                summaryData.approvedFaculty + summaryData.unapprovedFaculty
              }
              href="/admin/faculty"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardView;

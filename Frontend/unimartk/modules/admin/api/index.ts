import axios from "@/lib/axios";
import { Product } from "@/modules/products/types";
import { Skill } from "@/modules/skills/types";
import { User } from "../types";

export interface DashboardStats {
  totalProducts: number;
  totalUnapprovedProducts: number;
  totalApprovedProducts: number;
  totalPendingProducts: number;
  totalRejectedProducts: number;
  totalSkills: number;
  totalUnapprovedSkills: number;
  totalApprovedSkills: number;
  totalPendingSkills: number;
  totalRejectedSkills: number;
  totalUsersWithSuperUser: number;
  totalUsersWithoutSuperUser: number;
  totalInactiveUsers: number;
  totalActiveUsers: number;
  totalPendingAdmins: number;
  totalRejectedAdmins: number;
  totalUnapprovedAdmins: number;
  totalPendingFaculty: number;
  totalRejectedFaculty: number;
  totalUnapprovedFaculty: number;
  roleCounts: Record<string, number>;
}

export const fetchAdminProducts = async () => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/admin_dashboard/products/`);
  return response.data;
};

export const fetchAdminSkills = async () => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/admin_dashboard/skills/`);
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await axios.get(`/admin_dashboard/users/`);
  return response.data;
};

export const approveProduct = async ({
  productId,
  data,
}: {
  productId: string;
  data: Partial<Product>;
}) => {
  const response = await axios.put(
    `/admin_dashboard/products/${productId}/`,
    data
  );
  return response.data;
};

// Delete product
export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(
    `/admin_dashboard/products/${productId}/`
  );
  return response.data;
};

export const approveUser = async ({
  userId,
  data,
}: {
  userId: string;
  data: Partial<User>;
}) => {
  const response = await axios.put(`/admin_dashboard/users/${userId}/`, data);
  return response.data;
};

// Delete product
export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`/admin_dashboard/users/${userId}/`);
  return response.data;
};

export const approveSkill = async ({
  skillId,
  data,
}: {
  skillId: string;
  data: Partial<Skill>;
}) => {
  console.log("data", data);
  const response = await axios.put(`/admin_dashboard/skills/${skillId}/`, data);
  return response.data;
};

// Delete skill
export const deleteSkill = async (skillId: string) => {
  const response = await axios.delete(`/admin_dashboard/skills/${skillId}/`);
  return response.data;
};

// Fetch dashboard statistics using existing APIs
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // add logic to check if user is actually superadmin

    // Fetch all data in parallel
    const [products, skills, users]: [Product[], Skill[], User[]] =
      await Promise.all([
        fetchAdminProducts(),
        fetchAdminSkills(),
        fetchAdminUsers(),
      ]);

    // Calculate product statistics
    const totalProducts = products.length;
    const approvedProducts = products.filter(
      (p: Product) => p.status === "approved"
    ).length;
    const pendingProducts = products.filter(
      (p: Product) => p.status === "pending"
    ).length;
    const rejectedProducts = products.filter(
      (p: Product) => p.status === "rejected"
    ).length;
    const unapprovedProducts = pendingProducts + rejectedProducts;

    // Calculate skill statistics
    const totalSkills = skills.length;
    const approvedSkills = skills.filter(
      (s: Skill) => s.status === "approved"
    ).length;
    const pendingSkills = skills.filter(
      (s: Skill) => s.status === "pending"
    ).length;
    const rejectedSkills = skills.filter(
      (s: Skill) => s.status === "rejected"
    ).length;
    const unapprovedSkills = pendingSkills + rejectedSkills;

    // Calculate user statistics
    const totalUsersWithSuperUser = users.length;
    const totalUsersWithoutSuperUser = users.filter(
      (u: User) => u.role?.name !== "superuser"
    ).length;
    const activeUsers = users.filter((u: any) => u.is_active === true).length;
    const inactiveUsers = users.filter(
      (u: any) => u.is_active === false
    ).length;
    const roleCounts: Record<string, number> = {};

    // Initialize all roles with 0
    const allRoles = ["user", "faculty", "admin", "superuser"];
    allRoles.forEach((role) => {
      roleCounts[role] = 0;
    });

    // Count users per role
    users.forEach((user) => {
      const roleId = user.role?.name || "unknown";
      if (roleCounts.hasOwnProperty(roleId)) {
        roleCounts[roleId]++;
      }
    });

    const pendingAdmins = users.filter(
      (u: User) =>
        u.status === "pending" && u.is_admin && u.role.name !== "admin"
    ).length;

    const rejectedAdmins = users.filter(
      (u: User) =>
        u.status === "rejected" && u.is_admin && u.role.name !== "admin"
    ).length;

    const totalUnapprovedAdmins = pendingAdmins + rejectedAdmins;

    const pendingFaculty = users.filter(
      (u: User) =>
        u.status === "pending" && u.is_staff && u.role.name !== "faculty"
    ).length;

    const rejectedFaculty = users.filter(
      (u: User) =>
        u.status === "rejected" && u.is_staff && u.role.name !== "faculty"
    ).length;

    const totalUnapprovedFaculty = pendingFaculty + rejectedFaculty;

    return {
      totalProducts,
      totalUnapprovedProducts: unapprovedProducts,
      totalApprovedProducts: approvedProducts,
      totalPendingProducts: pendingProducts,
      totalRejectedProducts: rejectedProducts,
      totalSkills,
      totalUnapprovedSkills: unapprovedSkills,
      totalApprovedSkills: approvedSkills,
      totalPendingSkills: pendingSkills,
      totalRejectedSkills: rejectedSkills,
      totalUsersWithSuperUser,
      totalUsersWithoutSuperUser,
      totalInactiveUsers: inactiveUsers,
      totalActiveUsers: activeUsers,
      totalPendingAdmins: pendingAdmins,
      totalRejectedAdmins: rejectedAdmins,
      totalUnapprovedAdmins,
      totalPendingFaculty: pendingFaculty,
      totalRejectedFaculty: rejectedFaculty,
      totalUnapprovedFaculty,
      roleCounts,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Bulk operations
export const bulkApproveProducts = async (productIds: string[]) => {
  const response = await axios.post(`/admin_dashboard/products/bulk-approve/`, {
    product_ids: productIds,
  });
  return response.data;
};

export const bulkRejectProducts = async (productIds: string[]) => {
  const response = await axios.post(`/admin_dashboard/products/bulk-reject/`, {
    product_ids: productIds,
  });
  return response.data;
};

export const bulkApproveSkills = async (skillIds: string[]) => {
  const response = await axios.post(`/admin_dashboard/skills/bulk-approve/`, {
    skill_ids: skillIds,
  });
  return response.data;
};

export const bulkRejectSkills = async (skillIds: string[]) => {
  const response = await axios.post(`/admin_dashboard/skills/bulk-reject/`, {
    skill_ids: skillIds,
  });
  return response.data;
};
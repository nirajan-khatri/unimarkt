import axios from "@/lib/axios";

export const fetchAdminProducts = async () => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/admin_dashboard/products/`);
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await axios.get(`/admin_dashboard/users/`);
  return response.data;
};

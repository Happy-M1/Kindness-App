// Pro-Admin/src/services/userService.js
import api from "../utils/api.js";

export const getUsers = async (params) => {
  const res = await api.get("/admin/users", { params });
  return res?.data ?? res;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res?.data ?? res;
};

export const updateUserRole = async (id, role) => {
  const res = await api.put(`/admin/users/${id}/role`, { role });
  return res?.data ?? res;
};
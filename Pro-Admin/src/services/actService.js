// Pro-Admin/src/services/actService.js
import api from "../utils/api.js";

export const getActs = async (params) => {
  const res = await api.get("/admin/acts", { params });
  return res?.data ?? res;
};

export const deleteAct = async (id) => {
  const res = await api.delete(`/admin/acts/${id}`);
  return res?.data ?? res;
};

export const updateActStatus = async (id, status) => {
  const res = await api.put(`/admin/acts/${id}/status`, { status });
  return res?.data ?? res;
};
// Pro-Admin/src/services/auditService.js
import api from "../utils/api.js";

export const getAuditLogs = async (params) => {
  const res = await api.get("/admin/audit-logs", { params });
  return res?.data ?? res;
};
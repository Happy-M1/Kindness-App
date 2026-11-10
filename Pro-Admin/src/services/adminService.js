// Pro-Admin/src/services/adminService.js

import api from "../utils/api.js";

/**
 * Fetch the current admin profile data.
 */
export async function getAdminProfileService() {
  const res = await api.get("/admin/profile");
  return res?.data ?? res;
}

/**
 * Upload an admin avatar image to Cloudinary.
 * @param {FormData} formData
 */
export async function uploadAdminAvatarService(formData) {
  const res = await api.post("/admin/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res?.data ?? res;
}

/**
 * Update admin profile credentials.
 * @param {Object} profileData - { username, email, imageUrl }
 */
export async function updateAdminProfileService(profileData) {
  const res = await api.put("/admin/profile", profileData);
  return res?.data ?? res;
}

/**
 * Fetch all dashboard metrics and recent logs in parallel.
 */
export async function getDashboardDataService() {
  const [usersRes, logsRes, profileRes] = await Promise.all([
    api.get("/admin/users", { params: { page: 1, limit: 1 } }),
    api.get("/admin/audit-logs", { params: { page: 1, limit: 5 } }),
    getAdminProfileService(),
  ]);

  return {
    usersPayload: usersRes?.data ?? usersRes,
    logsPayload: logsRes?.data ?? logsRes,
    profilePayload: profileRes,
  };
}

/**
 * Fetch ecosystem graph nodes (users) and edges (acts) from the unified global ripple endpoint.
 */
export async function getEcosystemGraphService() {
  //const res = await api.get("/admin/ripple/global");
  const res = await api.get("/admin/ecosystem-graph");
  const payload = res?.data ?? res;
  return {
    nodes: payload?.nodes || [],
    edges: payload?.edges || [],
  };
}

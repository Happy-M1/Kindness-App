// pro-app/src/services/actService.js
import api from "../utils/api.js";

export const getMyActs = async () => {
  const res = await api.get("/acts/my");
  return res.acts; // ✅ res is already response.data
};

export const getPendingActsCount = async () => {
  try {
    const res = await api.get("/acts/my");
    // ✅ res.acts is the array
    const pendingActs = (res.acts || []).filter(
      (act) => act.status === "pending",
    );
    return pendingActs.length;
  } catch (err) {
    console.error("Failed to get pending count", err);
    return 0;
  }
};

export const acceptInvite = async (code) => {
  const res = await api.post("/invites/accept", { code });
  return res.data;
};

export const denyInvite = async (code, reason) => {
  const res = await api.post("/invites/deny", { code, reason });
  return res.data;
};

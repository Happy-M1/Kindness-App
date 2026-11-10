// pro-app/src/services/rippleService.js
import api from "../utils/api.js";

/*
export const getGlobalRippleGraph = async () => {
  const res = await api.get("/ripples/global");
  return res;  // ✅ res is already response.data
};


export const getPersonalRippleGraph = async () => {
  const res = await api.get("/ripples/my");
  return res;  // ✅ res is already response.data
};
*/

export const getEcosystemGraph = async () => {
  const res = await api.get("/ripples/ecosystem");
  return res;
};

// src/utils/logout.js
export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  window.location.href = "/login"; // redirect to login
};

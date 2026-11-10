// Pro-Admin/src/utils/parseUser.js

export function parseUserPayload(resOrPayload) {
  const payload = resOrPayload?.data ?? resOrPayload;
  const userObj = payload?._doc || payload?.data || payload?.user || payload;
  
  return {
    username: userObj?.username || userObj?.name || "Admin",
    email: userObj?.email || "admin@proadmin.com",
    imageUrl: userObj?.imageUrl || userObj?.avatarUrl || "",
    role: userObj?.role || "admin",
  };
}
// pro-app/src/services/impactStoryService.js
import api from "../utils/api.js";

export const getPublicImpactStories = async ({ previewMode, filter }) => {
  const res = await api.get("/impact-stories/public", {
    params: {
      limit: previewMode ? 3 : 10,
      type: filter === "all" ? "" : filter,
    },
  });
  const payload = res?.data ?? res;
  const list = payload?.stories ?? payload ?? [];
  return Array.isArray(list) ? list : [];
};

export const createImpactStory = async (formData) => {
  return await api.post("/impact-stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

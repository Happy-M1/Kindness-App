// pro-app/src/services/testimonialService.js
import api from "../utils/api.js";

export const getPublicTestimonials = async () => {
  const res = await api.get("/public/testimonials");
  const payload = res?.data ?? res;
  const list = payload?.testimonials ?? payload ?? [];
  return Array.isArray(list) ? list : [];
};

export const submitTestimonial = async (testimonialData) => {
  return await api.post("/public/testimonials", testimonialData);
};

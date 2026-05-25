const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");

export const API_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:5000/api";

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export const buildAssetUrl = (image) => {
  if (!image) return "/images/car-placeholder.jpg";

  const path = typeof image === "string" ? image : image.url;

  if (!path) return "/images/car-placeholder.jpg";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

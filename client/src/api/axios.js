import axios from "axios";

const localApiUrl = "http://localhost:5000";
const apiUrl = (import.meta.env.VITE_API_URL || localApiUrl).replace(/\/$/, "");

const normalizeApiUrl = (url) => {
  if (!url) return url;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.startsWith(localApiUrl)) {
      return `${apiUrl}${url.slice(localApiUrl.length)}`;
    }
    return url;
  }

  if (url.startsWith("/")) {
    return `${apiUrl}${url}`;
  }

  return `${apiUrl}/${url.replace(/^\/+/, "")}`;
};

axios.interceptors.request.use((config) => {
  if (config.url) {
    config.url = normalizeApiUrl(config.url);
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const request = error.config;
    const hasAuthHeader = Boolean(
      request?.headers?.Authorization || request?.headers?.authorization,
    );

    if (error.response?.status === 401 && hasAuthHeader) {
      localStorage.removeItem("userInfo");

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default axios;

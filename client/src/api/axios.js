import axios from "axios";

const localApiUrl = "http://localhost:5000";
const apiUrl = (import.meta.env.VITE_API_URL || localApiUrl).replace(/\/$/, "");

axios.interceptors.request.use((config) => {
  if (config.url?.startsWith(localApiUrl)) {
    config.url = `${apiUrl}${config.url.slice(localApiUrl.length)}`;
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

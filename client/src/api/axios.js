import axios from "axios";

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
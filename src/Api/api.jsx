import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:3002",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Tạo instance riêng cho refresh, KHÔNG có interceptor
const RefreshApi = axios.create({
  baseURL: "http://localhost:3002",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await RefreshApi.get("/auth/refresh"); // dùng instance riêng
        return Api(originalRequest); // gọi lại request cũ
      } catch (err) {
        console.error("Refresh token failed:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default Api;

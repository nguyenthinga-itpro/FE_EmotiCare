import axios from "axios";

const Api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:3001"
      : "https://emoticare-a3co.onrender.com",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ gửi cookie sang backend
});

const RefreshApi = axios.create({
  baseURL: "https://emoticare-a3co.onrender.com",
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

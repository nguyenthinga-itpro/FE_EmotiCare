import axios from "axios";
const Api = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // quan trọng để gửi cookie
});
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await Api.get("/auth/refresh"); // refresh token
        return Api(originalRequest); // retry request cũ
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
export default Api;

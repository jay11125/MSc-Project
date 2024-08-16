import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      let userData = JSON.parse(localStorage.getItem("user"));
      if (userData.refreshToken) {
        try {
          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${userData.refreshToken}` },
            }
          );
          const { access_token } = response.data;
          userData.accessToken = access_token
          localStorage.setItem("user", userData);
          api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (err) {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const signup = (email, password) => api.post("/auth/signup", { email, password });
export const login = (email, password) => api.post("/auth/login", { email, password });
export const getChats = (token) =>
  api.get("/chat/list", { headers: { Authorization: `Bearer ${token}` } });
export const getChat = (chatId, token) =>
  api.get(`/chat/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
export const deleteChat = (chatId, token) =>
  api.delete("/chat/delete", {
    data: { chat_id: chatId },
    headers: { Authorization: `Bearer ${token}` },
  });
export const uploadDocument = (formData, token) =>
  api.post("/document/upload", formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
export const queryChat = (chatId, query, token) =>
  api.post(
    "/chat/query",
    { chat_id: chatId, query },
    { headers: { Authorization: `Bearer ${token}` } }
  );

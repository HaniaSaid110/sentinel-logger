import axiosInstance from "../lib/axios";
import { Developer } from "../contexts/AuthContext";

export const authService = {
  getMe: async (): Promise<{ developer: Developer } | null> => {
    try {
      const response = await axiosInstance.get("/users/me");
      return response.data;
    } catch {
      return null;
    }
  },

  login: async (email: string, password: string): Promise<{ developer: Developer }> => {
    try {
      const response = await axiosInstance.post("/users/login", { email, password });
      return response.data;
    } catch (error: unknown) {
      if (axiosInstance.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed", { cause: error });
      }
      throw new Error("Login failed", { cause: error });
    }
  },

  register: async (username: string, email: string, password: string): Promise<{ developer: Developer }> => {
    try {
      const response = await axiosInstance.post("/users/register", { username, email, password });
      return response.data;
    } catch (error: unknown) {
      if (axiosInstance.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Registration failed", { cause: error });
      }
      throw new Error("Registration failed", { cause: error });
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
};

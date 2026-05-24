import axiosInstance from "../lib/axios";
import axios from "axios";

export interface Application {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export const applicationService = {
  getApplications: async (): Promise<{ data: Application[] }> => {
    try {
      const response = await axiosInstance.get("/applications");
      return { data: response.data.applications }; // e.g. { data: [...] } or { status: "success", data: [...] }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch applications",
          { cause: error },
        );
      }
      throw new Error("Failed to fetch applications", { cause: error });
    }
  },

  createApplication: async (name: string): Promise<{ data: Application }> => {
    try {
      const response = await axiosInstance.post("/applications", { name });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to create application",
          { cause: error },
        );
      }
      throw new Error("Failed to create application", { cause: error });
    }
  },

  deleteApplication: async (name: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/applications/${name}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete application",
          { cause: error },
        );
      }
      throw new Error("Failed to delete application", { cause: error });
    }
  },
};

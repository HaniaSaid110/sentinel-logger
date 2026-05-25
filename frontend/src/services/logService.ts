import axiosInstance from "../lib/axios";
import axios from "axios";

export interface Log {
  _id: string;
  message: string;
  level: "INFO" | "WARN" | "ERROR";
  count: number;
  applicationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetLogsParams {
  page?: number;
  limit?: number;
  level?: string;
  message?: string;
  sortBy?: string;
}

export interface GetLogsResponse {
  logs: Log[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const logService = {
  getLogs: async (appName: string, params?: GetLogsParams): Promise<GetLogsResponse> => {
    try {
      const response = await axiosInstance.get(`/applications/${appName}/logs`, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch logs", { cause: error });
      }
      throw new Error("Failed to fetch logs", { cause: error });
    }
  },
};

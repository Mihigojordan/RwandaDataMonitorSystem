/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../api/api"; // ✅ Adjust path to your shared axios instance
import { type AxiosInstance, type AxiosResponse } from "axios"; // type-only imports

// --- Interfaces ---

/**
 * Data structure for creating or updating a national figure
 */
export interface NationalFigureData {
  indicatorName: string;
  money: number;
  year: number;
  quarter?: number | null;
}

/**
 * Full National Figure object (as returned by backend)
 */
export interface NationalFigure extends NationalFigureData {
  id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Delete response
 */
export interface DeleteResponse {
  message: string;
}

/**
 * Stats interface — can be expanded depending on API
 */
export interface NationalFigureStats {
  [key: string]: unknown;
}

/**
 * National Figures Service
 */
class NationalFiguresService {
  private api: AxiosInstance = api;

  /**
   * Create a new national figure
   */
  async createFigure(data: NationalFigureData): Promise<NationalFigure> {
    try {
      const response: AxiosResponse<NationalFigure> = await this.api.post(
        "/national-figures",
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating national figure:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create national figure";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all national figures
   */
  async getAll(): Promise<NationalFigure[]> {
    try {
      const response: AxiosResponse<NationalFigure[]> = await this.api.get(
        "/national-figures"
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching national figures:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch national figures";
      throw new Error(errorMessage);
    }
  }

  /**
   * Get figure by ID
   */
  async getById(id: string): Promise<NationalFigure | null> {
    try {
      const response: AxiosResponse<NationalFigure> = await this.api.get(
        `/national-figures/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error("Error fetching figure by ID:", error);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch figure"
      );
    }
  }

  /**
   * Update national figure
   */
  async updateFigure(
    id: string,
    updateData: Partial<NationalFigureData>
  ): Promise<NationalFigure> {
    try {
      const response: AxiosResponse<NationalFigure> = await this.api.put(
        `/national-figures/${id}`,
        updateData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating national figure:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update national figure";
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete national figure
   */
  async deleteFigure(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(
        `/national-figures/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting national figure:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete national figure";
      throw new Error(errorMessage);
    }
  }

  /**
   * Search by indicator name
   */
  async findByName(searchTerm: string): Promise<NationalFigure[]> {
    try {
      const response: AxiosResponse<NationalFigure[]> = await this.api.get(
        `/national-figures/search?indicatorName=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      console.error("Error searching national figures:", error);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to search national figures"
      );
    }
  }

  /**
   * Validate national figure data before sending
   */
  validateFigureData(data: NationalFigureData): ValidationResult {
    const errors: string[] = [];

    if (!data.indicatorName?.trim()) {
      errors.push("Indicator name is required");
    } else if (data.indicatorName.length < 3) {
      errors.push("Indicator name must be at least 3 characters long");
    } else if (data.indicatorName.length > 100) {
      errors.push("Indicator name must not exceed 100 characters");
    }

    if (isNaN(data.money) || data.money <= 0) {
      errors.push("Money value must be a positive number");
    }

    if (
      !data.year ||
      typeof data.year !== "number" ||
      data.year < 1900 ||
      data.year > new Date().getFullYear() + 1
    ) {
      errors.push("Year must be a valid number");
    }

    if (data.quarter && ![1, 2, 3, 4].includes(data.quarter)) {
      errors.push("Quarter must be 1, 2, 3, or 4");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate ID format
   */
  isValidId(id: string): boolean {
    return Boolean(id && typeof id === "string" && id.trim().length > 0);
  }

  /**
   * Check if figure exists
   */
  async figureExists(id: string): Promise<boolean> {
    try {
      const figure = await this.getById(id);
      return figure !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get statistics (e.g. averages, totals)
   */
  async getStats(): Promise<NationalFigureStats> {
    try {
      const response: AxiosResponse<NationalFigureStats> = await this.api.get(
        "/national-figures/stats"
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching national figure statistics:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch national figure statistics";
      throw new Error(errorMessage);
    }
  }
}

// ✅ Singleton instance
const nationalFiguresService = new NationalFiguresService();
export default nationalFiguresService;

// ✅ Named exports (for destructuring imports)
export const {
  createFigure,
  getAll,
  getById,
  updateFigure,
  deleteFigure,
  findByName,
  validateFigureData,
  figureExists,
  getStats,
} = nationalFiguresService;

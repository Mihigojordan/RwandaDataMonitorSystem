import { type AxiosInstance, type AxiosResponse } from 'axios';
import api from '../api/api'; // adjust path to your axios instance

// GDP Growth Record Type
export interface GdpGrowthBySector {
  id: string;
  totalGdp: number;
  servicesShare: number;
  industryShare: number;
  agricultureShare: number;
  
  servicesSubShares: Record<string, number>;
  agricultureSubShares: Record<string, number>;
  industrySubShares: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Input types
export type CreateGdpGrowthInput = Omit<
  GdpGrowthBySector,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateGdpGrowthInput = Partial<CreateGdpGrowthInput>;

// Delete response
interface DeleteResponse {
  message: string;
}

/**
 * GDP Growth By Sector Service
 * Handles all API calls for GDP growth by sector at constant price
 */
class GdpGrowthBySectorService {
  private api: AxiosInstance = api;

  /**
   * Create a new GDP record
   */
  async createRecord(data: CreateGdpGrowthInput): Promise<GdpGrowthBySector> {
    try {
      const response: AxiosResponse<GdpGrowthBySector> = await this.api.post(
        '/gdp-growth-by-sector-at-constant-price',
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating GDP record:', error);
      const message =
        error.response?.data?.message || error.message || 'Failed to create GDP record';
      throw new Error(message);
    }
  }

  /**
   * Fetch all GDP records
   */
  async getAllRecords(): Promise<GdpGrowthBySector[]> {
    try {
      const response: AxiosResponse<GdpGrowthBySector[]> = await this.api.get(
        '/gdp-growth-by-sector-at-constant-price',
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching GDP records:', error);
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch GDP records';
      throw new Error(message);
    }
  }

  /**
   * Fetch single GDP record by ID
   */
  async getRecordById(id: string): Promise<GdpGrowthBySector | null> {
    try {
      const response: AxiosResponse<GdpGrowthBySector> = await this.api.get(
        `/gdp-growth-by-sector-at-constant-price/${id}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error('Error fetching GDP record by ID:', error);
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch GDP record';
      throw new Error(message);
    }
  }

  /**
   * Update GDP record
   */
  async updateRecord(
    id: string,
    data: UpdateGdpGrowthInput,
  ): Promise<GdpGrowthBySector> {
    try {
      const response: AxiosResponse<GdpGrowthBySector> = await this.api.patch(
        `/gdp-growth-by-sector-at-constant-price/${id}`,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating GDP record:', error);
      const message =
        error.response?.data?.message || error.message || 'Failed to update GDP record';
      throw new Error(message);
    }
  }

  /**
   * Delete GDP record
   */
  async deleteRecord(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(
        `/gdp-growth-by-sector-at-constant-price/${id}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error deleting GDP record:', error);
      const message =
        error.response?.data?.message || error.message || 'Failed to delete GDP record';
      throw new Error(message);
    }
  }
}

// Singleton instance
const gdpGrowthService = new GdpGrowthBySectorService();
export default gdpGrowthService;

// Named exports for convenience
export const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = gdpGrowthService;

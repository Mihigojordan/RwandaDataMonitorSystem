// src/services/noPovertyTargetService.ts
import axios from "axios";

export interface NoPovertyTarget {
  id?: string;
  targetName: string;
  targetDescription?: string;
  targetPercentage?: number;
  source?: string;
  trend?: { year: number; percentage: number }[];
  map?: { year: number; location: string; povertyRate: number }[];
  createdAt?: string;
  updatedAt?: string;
}

export type NoPovertyTargetData = Omit<NoPovertyTarget, "id" | "createdAt" | "updatedAt">;

const API_URL = "http://localhost:8000/no-poverty-targets";

const noPovertyTargetService = {
  async getAll(): Promise<NoPovertyTarget[]> {
    const res = await axios.get(API_URL);
    return res.data;
  },
  async getOne(id: string): Promise<NoPovertyTarget> {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  async createTarget(data: NoPovertyTargetData): Promise<NoPovertyTarget> {
    const res = await axios.post(API_URL, data);
    return res.data;
  },
  async updateTarget(id: string, data: Partial<NoPovertyTargetData>): Promise<NoPovertyTarget> {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },
  async deleteTarget(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default noPovertyTargetService;

import axios from 'axios';
import { Waste } from '@/types/waste';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ScheduleResponse {
  type: 'SPECIAL' | 'STANDARD' | 'NONE';
  message: string;
  is_cancelled: boolean;
  time?: string;
  waste_type?: string;
  note?: string;
}

export interface Location {
  _id: string;
  name: string;
  type: string;
  address_hint: string;
  phone_number: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [Longitude, Latitude] - [Kinh độ, Vĩ độ]
  };
  accepted_items: string[];
}

export const wasteApi = {
  getAll: async (keyword?: string): Promise<Waste[]> => {
    try {
      const response = await api.get('/wastes', {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gọi API wastes:', error);
      return [];
    }
  },

  getTodaySchedule: async (villageName: string): Promise<ScheduleResponse | null> => {
    try {
      const response = await api.get('/schedules/today', {
        params: { village: villageName },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy lịch:', error);
      return null;
    }
  },

  getLocations: async (): Promise<Location[]> => {
    try {
      const response = await api.get('/locations'); 
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy danh sách địa điểm:', error);
      return [];
    }
  },
};
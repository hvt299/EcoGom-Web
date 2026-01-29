import axios from 'axios';
import { Waste } from '@/types/waste';
import { ScheduleResponse } from '@/types/schedule';
import { Location } from '@/types/location';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

  create: async (data: Partial<Waste>): Promise<Waste | null> => {
    try {
      const response = await api.post('/wastes', data);
      return response.data;
    } catch (error) {
      console.error('Lỗi tạo rác:', error);
      return null;
    }
  },

  update: async (id: string, data: Partial<Waste>): Promise<Waste | null> => {
    try {
      const response = await api.patch(`/wastes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/wastes/${id}`);
      return true;
    } catch (error) {
      console.error('Lỗi xóa rác:', error);
      return false;
    }
  },
};

export const scheduleApi = {
  getAll: async () => {
    try {
      const res = await api.get('/schedules'); 
      return res.data;
    } catch (e) { return []; }
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

  create: async (data: any) => {
    try { return (await api.post('/schedules', data)).data; } catch (e) { return null; }
  },

  update: async (id: string, data: any) => {
    try { return (await api.patch(`/schedules/${id}`, data)).data; } catch (e) { return null; }
  },

  delete: async (id: string) => {
    try { await api.delete(`/schedules/${id}`); return true; } catch (e) { return false; }
  },
};

export const locationApi = {
  getAll: async () => {
    try { return (await api.get('/locations')).data; } catch (e) { return []; }
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

  create: async (data: any) => {
    try { return (await api.post('/locations', data)).data; } catch (e) { return null; }
  },

  update: async (id: string, data: any) => {
    try { return (await api.patch(`/locations/${id}`, data)).data; } catch (e) { return null; }
  },

  delete: async (id: string) => {
    try { await api.delete(`/locations/${id}`); return true; } catch (e) { return false; }
  },
};

export const authApi = {
  login: (code: string) => {
    return code === "admin123";
  },
};
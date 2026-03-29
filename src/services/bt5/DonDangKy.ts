// Đường dẫn: src/services/bt5/DonDangKy.ts
import axios from '@/utils/axios'; // Đã thấy file này trong cấu trúc của bạn
import { IDonDangKy } from '@/models/bt5/interfaces';

const prefix = '/api/bt5/don-dang-ky';

export const getDonDangKy = (params?: any) => {
  return axios.get(prefix, { params });
};

export const addDonDangKy = (data: Partial<IDonDangKy>) => {
  return axios.post(prefix, data);
};

export const updateDonDangKy = (id: string, data: Partial<IDonDangKy>) => {
  return axios.put(`${prefix}/${id}`, data);
};

export const deleteDonDangKy = (id: string) => {
  return axios.delete(`${prefix}/${id}`);
};

// Hàm quan trọng: Duyệt hoặc Từ chối (hỗ trợ hàng loạt)
export const changeStatusDonDangKy = (payload: { 
  ids: string[]; 
  trangThai: 'Approved' | 'Rejected'; 
  lyDo?: string;
}) => {
  return axios.post(`${prefix}/change-status`, payload);
};
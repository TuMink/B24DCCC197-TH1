import axios from '@/utils/axios'; 
import { ICauLacBo } from '@/models/bt5/interfaces';

// Lưu ý: Dùng /api/ để khớp với base của PTIT
const prefix = '/api/bt5/cau-lac-bo';

export const getCauLacBo = (params?: any) => {
  return axios.get(`${prefix}/page`, { params });
};

export const getAllCauLacBo = () => {
  return axios.get(`${prefix}/all`);
};

export const addCauLacBo = (data: Partial<ICauLacBo>) => {
  return axios.post(prefix, data);
};

export const updateCauLacBo = (id: string, data: Partial<ICauLacBo>) => {
  return axios.put(`${prefix}/${id}`, data);
};

export const deleteCauLacBo = (id: string) => {
  return axios.delete(`${prefix}/${id}`);
};
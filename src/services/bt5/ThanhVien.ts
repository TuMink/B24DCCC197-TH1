import axios from '@/utils/axios';

// Dùng chung prefix với đơn đăng ký vì thực chất dữ liệu nằm chung 1 bảng
const prefix = '/api/bt5';

// Vẫn lấy data từ API đơn đăng ký, nhưng lát nữa ở Model mình sẽ LỌC ra
export const getThanhVien = (params?: any) => axios.get(`${prefix}/don-dang-ky`, { params });

export const changeClub = (payload: { ids: string[]; newCauLacBoId: string; }) => {
  return axios.post(`${prefix}/thanh-vien/change-club`, payload);
};
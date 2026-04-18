import axios from '@/utils/axios';

// 1. Lấy danh sách điểm đến cho Admin (Có thể lấy cả những điểm đang bị ẩn/Inactive)
export const getAdminDestinations = async (params?: any) => {
  const response = await axios.get('/api/th6/admin/destinations', { params });
  return response?.data;
};

// 2. Thêm điểm đến mới (Thay thế hàm cũ)
export const addDestination = async (data: Partial<BaiTap6.Destination>) => {
  const response = await axios.post('/api/th6/admin/destinations', data);
  return response?.data;
};

// 3. Cập nhật thông tin điểm đến
export const updateDestination = async (id: string, data: Partial<BaiTap6.Destination>) => {
  const response = await axios.put(`/api/th6/admin/destinations/${id}`, data);
  return response?.data;
};

// 4. Xóa điểm đến
export const deleteDestination = async (id: string) => {
  const response = await axios.delete(`/api/th6/admin/destinations/${id}`);
  return response?.data;
};
import axios from '@/utils/axios';

// 1. Lấy thống kê tổng hợp theo tháng (Doanh thu, số lượt lịch trình...)
export const getMonthlyStatistics = async (params?: { month?: string; year?: string }) => {
  const response = await axios.get('/api/th6/admin/statistics/monthly', { params });
  return response?.data;
};

// 2. Lấy danh sách các địa điểm được yêu thích nhất (Ví dụ: top 5)
export const getPopularDestinations = async (limit: number = 5) => {
  const response = await axios.get('/api/th6/admin/statistics/popular', { params: { limit } });
  return response?.data;
};
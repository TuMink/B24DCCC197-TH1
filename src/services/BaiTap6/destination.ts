import axios from '@/utils/axios';

export const getDestinations = async () => {
  const response = await axios.get('/api/th6/destinations');
  return response?.data?.data || [];
};
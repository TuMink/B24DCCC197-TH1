import { useState } from 'react';
import { getCauLacBo, addCauLacBo, updateCauLacBo, deleteCauLacBo } from '@/services/bt5/CauLacBo';
import { ICauLacBo } from './interfaces';

export default () => {
  const [danhSach, setDanhSach] = useState<ICauLacBo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy danh sách CLB
  const getModel = async () => {
    setLoading(true);
    try {
      const res = await getCauLacBo();
      // Bắt mọi trường hợp trả về của Axios (tùy theo cấu hình base của trường)
      const data = res?.data?.data?.result || res?.data?.data || res?.data || [];
      setDanhSach(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách CLB:', error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm mới CLB
  const postModel = async (data: Partial<ICauLacBo>) => {
    try {
      await addCauLacBo(data);
    } catch (error) {
      console.error('Lỗi thêm mới:', error);
      throw error; // Ném lỗi ra để bên Giao diện (index.tsx) bắt và thông báo
    }
  };

  // Cập nhật CLB
  const putModel = async (id: string, data: Partial<ICauLacBo>) => {
    try {
      await updateCauLacBo(id, data);
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      throw error;
    }
  };

  // Xóa CLB
  const deleteModel = async (id: string) => {
    try {
      await deleteCauLacBo(id);
    } catch (error) {
      console.error('Lỗi xóa:', error);
      throw error;
    }
  };

  // Trả tất cả state và function ra ngoài cho file index.tsx (Giao diện) dùng
  return {
    danhSach,
    loading,
    getModel,
    postModel,
    putModel,
    deleteModel,
  };
};
import { useState, useEffect } from 'react';
import { getDanhSachDichVu, themDichVu, suaDichVu, xoaDichVu } from '@/services/BaiTap3/dichVu';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getDanhSachDichVu();
    setDanhSach(res);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddDichVu = async (values: any) => {
    await themDichVu(values);
    await fetchData();
  };

  // --- THÊM HÀM XỬ LÝ SỬA & XÓA ---
  const handleEditDichVu = async (id: string, values: any) => {
    await suaDichVu(id, values);
    await fetchData();
  };

  const handleDeleteDichVu = async (id: string) => {
    await xoaDichVu(id);
    await fetchData();
  };

  return {
    danhSach, loading, fetchData,
    handleAddDichVu, handleEditDichVu, handleDeleteDichVu,
  };
};
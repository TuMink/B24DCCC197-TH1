import { useState, useEffect } from 'react';
import { getDanhSachDanhGia, themDanhGia, capNhatPhanHoi } from '@/services/BaiTap3/danhGia';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setDanhSach(await getDanhSachDanhGia());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddDanhGia = async (values: any) => {
    await themDanhGia(values);
    await fetchData();
  };

  const handlePhanHoi = async (id: string, phanHoi: string) => {
    await capNhatPhanHoi(id, phanHoi);
    await fetchData();
  };

  return { danhSach, loading, handleAddDanhGia, handlePhanHoi };
};
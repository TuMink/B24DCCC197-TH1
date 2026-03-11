import { useState, useEffect } from 'react';
import { getDanhSachNhanVien, themNhanVien, suaNhanVien, xoaNhanVien } from '@/services/BaiTap3/nhanVien';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getDanhSachNhanVien();
    setDanhSach(res);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddNhanVien = async (values: any) => {
    await themNhanVien(values);
    await fetchData(); 
  };

  const handleEditNhanVien = async (id: string, values: any) => {
    await suaNhanVien(id, values);
    await fetchData();
  };

  const handleDeleteNhanVien = async (id: string) => {
    await xoaNhanVien(id);
    await fetchData();
  };

  return {
    danhSach, loading, fetchData,
    handleAddNhanVien, handleEditNhanVien, handleDeleteNhanVien,
  };
};
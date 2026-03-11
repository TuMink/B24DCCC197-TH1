import { useState, useEffect } from 'react';
import { getDanhSachLichHen, themLichHen, doiTrangThaiLichHen, suaLichHen, xoaLichHen } from '@/services/BaiTap3/lichHen';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setDanhSach(await getDanhSachLichHen());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddLichHen = async (values: any) => {
    await themLichHen(values);
    await fetchData(); 
  };

  const handleChangeStatus = async (id: string, status: string) => {
    await doiTrangThaiLichHen(id, status);
    await fetchData();
  };

  const handleEditLichHen = async (id: string, values: any) => {
    await suaLichHen(id, values);
    await fetchData();
  };

  const handleDeleteLichHen = async (id: string) => {
    await xoaLichHen(id);
    await fetchData();
  };

  return { 
    danhSach, loading, fetchData, 
    handleAddLichHen, handleChangeStatus, handleEditLichHen, handleDeleteLichHen 
  };
};
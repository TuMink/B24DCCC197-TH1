import { useState, useEffect } from 'react';
import { message } from 'antd';
import * as donDangKyServices from '@/services/bt5/DonDangKy';
import { IDonDangKy } from './interfaces';

export default function useDonDangKyModel() {
  const [danhSachDon, setDanhSachDon] = useState<IDonDangKy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleTuChoi, setVisibleTuChoi] = useState<boolean>(false);
  const [visibleLichSu, setVisibleLichSu] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<IDonDangKy | null>(null);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await donDangKyServices.getDonDangKy();
      if (res?.data?.success) setDanhSachDon(res.data.data);
    } catch (error) { message.error('Lỗi khi lấy danh sách!'); } 
    finally { setLoading(false); }
  };

  const handleThemMoi = async (values: Partial<IDonDangKy>) => {
    try {
      const res = await donDangKyServices.addDonDangKy(values);
      if (res?.data?.success) {
        message.success('Thêm mới thành công!');
        setVisibleForm(false);
        fetchDanhSach();
      }
    } catch (error) { message.error('Thêm mới thất bại!'); }
  };

  const handleCapNhat = async (id: string, values: Partial<IDonDangKy>) => {
    try {
      const res = await donDangKyServices.updateDonDangKy(id, values);
      if (res?.data?.success) {
        message.success('Cập nhật thành công!');
        setVisibleForm(false);
        fetchDanhSach();
      }
    } catch (error) { message.error('Cập nhật thất bại!'); }
  };

  const handleXoa = async (id: string) => {
    try {
      const res = await donDangKyServices.deleteDonDangKy(id);
      if (res?.data?.success) { message.success('Xóa thành công!'); fetchDanhSach(); }
    } catch (error) { message.error('Lỗi khi xóa!'); }
  };

  const handleThayDoiTrangThai = async (ids: string[], trangThai: 'Approved' | 'Rejected', lyDo?: string) => {
    try {
      const res = await donDangKyServices.changeStatusDonDangKy({ ids, trangThai, lyDo });
      if (res?.data?.success) {
        message.success(`Đã ${trangThai === 'Approved' ? 'duyệt' : 'từ chối'} thành công!`);
        setVisibleTuChoi(false);
        setSelectedRowKeys([]);
        fetchDanhSach();
      }
    } catch (error) { message.error('Thao tác thất bại!'); }
  };

  useEffect(() => { fetchDanhSach(); }, []);

  return {
    danhSachDon, loading, fetchDanhSach,
    selectedRowKeys, setSelectedRowKeys,
    visibleForm, setVisibleForm,
    visibleTuChoi, setVisibleTuChoi,
    visibleLichSu, setVisibleLichSu,
    currentRecord, setCurrentRecord,
    handleThemMoi, handleCapNhat, handleXoa, handleThayDoiTrangThai
  };
}
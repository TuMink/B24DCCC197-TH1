import { useState, useEffect } from 'react';
import { message } from 'antd';
import * as thanhVienServices from '@/services/bt5/ThanhVien';
import { IDonDangKy } from './interfaces';

export default function useThanhVienModel() {
  const [danhSachThanhVien, setDanhSachThanhVien] = useState<IDonDangKy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // State quản lý Modal đổi CLB
  const [visibleModalDoiCLB, setVisibleModalDoiCLB] = useState<boolean>(false);
  const [currentMemberIds, setCurrentMemberIds] = useState<string[]>([]);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await thanhVienServices.getThanhVien();
      if (res?.data?.success) {
        console.log('Tất cả dữ liệu trả về từ API:', res.data.data);
        // QUAN TRỌNG: Chỉ lấy những người có trạng thái là 'Approved'
        const approvedMembers = res.data.data.filter((item: IDonDangKy) => item.trangThai === 'Approved');
        console.log('Dữ liệu sau khi lọc Approved:', approvedMembers);
        setDanhSachThanhVien(approvedMembers);
      }
    } catch (error) {
      message.error('Lỗi khi lấy danh sách thành viên!');
    } finally {
      setLoading(false);
    }
  };

  const handleDoiCLB = async (ids: string[], newCauLacBoId: string) => {
    try {
      const res = await thanhVienServices.changeClub({ ids, newCauLacBoId });
      if (res?.data?.success) {
        message.success(res.data.message);
        setVisibleModalDoiCLB(false);
        setSelectedRowKeys([]); // Reset checkbox
        fetchDanhSach();        // Load lại danh sách
      }
    } catch (error) {
      message.error('Đổi CLB thất bại!');
    }
  };

  useEffect(() => {
    fetchDanhSach();
  }, []);

  return {
    danhSachThanhVien, loading, fetchDanhSach,
    selectedRowKeys, setSelectedRowKeys,
    visibleModalDoiCLB, setVisibleModalDoiCLB,
    currentMemberIds, setCurrentMemberIds,
    handleDoiCLB
  };
}
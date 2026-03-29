import { Request, Response } from 'express';

// Khởi tạo dữ liệu mẫu (Mock Data)
let donDangKyList = [
  {
    id: '1',
    hoTen: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    sdt: '0987654321',
    gioiTinh: 'Nam',
    diaChi: 'Hà Nội',
    soTruong: 'Hát, Nhảy',
    cauLacBoId: 'CLB_01', // Khớp với ID trong mock Câu lạc bộ
    lyDoDangKy: 'Muốn giao lưu học hỏi',
    trangThai: 'Pending',
    ghiChu: '',
    lichSuThaoTac: [
      {
        id: 'ls1',
        nguoiThucHien: 'Hệ thống',
        thoiGian: '08:00 01/04/2025',
        hanhDong: 'Pending',
        lyDo: 'Tạo mới đơn đăng ký'
      }
    ],
  },
  {
    id: '2',
    hoTen: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    sdt: '0912345678',
    gioiTinh: 'Nữ',
    diaChi: 'Hải Phòng',
    soTruong: 'Đánh đàn',
    cauLacBoId: 'CLB_02',
    lyDoDangKy: 'Đam mê âm nhạc',
    trangThai: 'Pending',
    ghiChu: '',
    lichSuThaoTac: [],
  }
];

export default {
  // 1. Lấy danh sách đơn đăng ký
  'GET /api/bt5/don-dang-ky': (req: Request, res: Response) => {
    res.status(200).send({
      data: donDangKyList,
      total: donDangKyList.length,
      success: true,
    });
  },

  // 2. Thêm mới đơn đăng ký
  'POST /api/bt5/don-dang-ky': (req: Request, res: Response) => {
    const newData = req.body;
    const newDon = {
      ...newData,
      id: Math.random().toString(36).substr(2, 9), // Random ID
      trangThai: 'Pending',
      lichSuThaoTac: [
        {
          id: Math.random().toString(36).substr(2, 9),
          nguoiThucHien: 'Hệ thống',
          thoiGian: new Date().toLocaleString('vi-VN'),
          hanhDong: 'Pending',
          lyDo: 'Tạo mới đơn đăng ký'
        }
      ]
    };
    donDangKyList.unshift(newDon); // Thêm lên đầu danh sách
    res.status(200).send({ success: true, message: 'Thêm mới thành công' });
  },

  // 3. Cập nhật đơn đăng ký (Chỉnh sửa)
  'PUT /api/bt5/don-dang-ky/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    donDangKyList = donDangKyList.map((item) =>
      item.id === id ? { ...item, ...updateData } : item
    );
    res.status(200).send({ success: true, message: 'Cập nhật thành công' });
  },

  // 4. Xóa đơn đăng ký
  'DELETE /api/bt5/don-dang-ky/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    donDangKyList = donDangKyList.filter((item) => item.id !== id);
    res.status(200).send({ success: true, message: 'Xóa thành công' });
  },

  // 5. API QUAN TRỌNG: Duyệt / Từ chối (Hỗ trợ làm hàng loạt)
  'POST /api/bt5/don-dang-ky/change-status': (req: Request, res: Response) => {
    const { ids, trangThai, lyDo, nguoiThucHien = 'Admin' } = req.body; 
    // ids là một mảng string: ['1', '2']
    
    if (!ids || ids.length === 0) {
      return res.status(400).send({ success: false, message: 'Không có ID nào được chọn!' });
    }

    const thoiGianHienTai = new Date().toLocaleString('vi-VN');

    donDangKyList = donDangKyList.map((item) => {
      // Nếu id của item nằm trong mảng các đơn cần đổi trạng thái
      if (ids.includes(item.id)) {
        const thaoTacMoi = {
          id: Math.random().toString(36).substr(2, 9),
          nguoiThucHien: nguoiThucHien,
          thoiGian: thoiGianHienTai,
          hanhDong: trangThai,
          lyDo: trangThai === 'Rejected' ? lyDo : 'Đã duyệt đơn'
        };

        return {
          ...item,
          trangThai: trangThai,
          ghiChu: trangThai === 'Rejected' ? lyDo : item.ghiChu, // Cập nhật ghi chú nếu từ chối
          lichSuThaoTac: [thaoTacMoi, ...(item.lichSuThaoTac || [])] // Đẩy lịch sử mới lên đầu
        };
      }
      return item;
    });

    res.status(200).send({ 
      success: true, 
      message: `Đã ${trangThai === 'Approved' ? 'duyệt' : 'từ chối'} ${ids.length} đơn thành công!` 
    });
  },
  // 6. API Đổi Câu lạc bộ cho Thành viên (Hỗ trợ hàng loạt)
  'POST /api/bt5/thanh-vien/change-club': (req: Request, res: Response) => {
    const { ids, newCauLacBoId, nguoiThucHien = 'Admin' } = req.body;
    
    if (!ids || ids.length === 0) {
      return res.status(400).send({ success: false, message: 'Không có ID nào được chọn!' });
    }

    const thoiGianHienTai = new Date().toLocaleString('vi-VN');

    donDangKyList = donDangKyList.map((item) => {
      if (ids.includes(item.id)) {
        const thaoTacMoi = {
          id: Math.random().toString(36).substr(2, 9),
          nguoiThucHien: nguoiThucHien,
          thoiGian: thoiGianHienTai,
          hanhDong: 'Approved' as any,
          lyDo: `Chuyển sang CLB mới: ${newCauLacBoId}`
        };

        return {
          ...item,
          cauLacBoId: newCauLacBoId,
          lichSuThaoTac: [thaoTacMoi, ...(item.lichSuThaoTac || [])]
        };
      }
      return item;
    });

    res.status(200).send({ success: true, message: `Đã đổi CLB cho ${ids.length} thành viên thành công!` });
  },
};
export interface ICauLacBo {
  id?: string;
  anhDaiDien?: string; 
  tenCLB: string;
  ngayThanhLap: string;
  moTa?: string;       // Sẽ dùng TinyEditor để nhập cái này
  chuNhiem: string;
  hoatDong: boolean;   
}

// Bạn có thể để sẵn IDonDangKy của đồng đội ở dưới luôn nếu muốn, không thì thôi
// Trạng thái đơn đăng ký
export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

// Ghi nhận lịch sử thao tác
export interface ILichSuThaoTac {
  id: string;
  nguoiThucHien: string; // VD: "Admin"
  thoiGian: string;      // VD: "17:09 09/04/2025"
  hanhDong: ApplicationStatus;
  lyDo?: string;         // Chỉ có khi Rejected
}

// Cấu trúc Đơn đăng ký chính
export interface IDonDangKy {
  id: string;
  hoTen: string;
  email: string;
  sdt: string;
  gioiTinh: string;
  diaChi: string;
  soTruong: string;
  cauLacBoId: string;    // ID liên kết với danh mục Câu lạc bộ
  lyDoDangKy: string;
  trangThai: ApplicationStatus;
  ghiChu?: string;       // Lý do từ chối hiện tại (nếu có)
  lichSuThaoTac: ILichSuThaoTac[]; // Mảng lưu lịch sử duyệt/từ chối
}

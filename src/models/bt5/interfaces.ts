export interface ICauLacBo {
  id?: string;
  anhDaiDien: string; 
  tenCLB: string;
  ngayThanhLap: string;
  moTa: string;       
  chuNhiem: string;
  hoatDong: boolean;  
}

// (Tạm thời cứ để đây cho đồng đội dùng luôn)
export interface IDonDangKy {
  id?: string;
  hoTen: string;
  email: string;
  idCLB: string;
  trangThai: 'Pending' | 'Approved' | 'Rejected';
  // ... các trường khác
}
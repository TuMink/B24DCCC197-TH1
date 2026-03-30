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
import useInitModel from '@/hooks/useInitModel';

// 1. Định nghĩa cấu trúc dữ liệu của Sổ Văn Bằng
export interface ISoVanBang {
  id?: string;
  _id?: string;
  nam: number;
  soHienTai: number;
}

// 2. Xuất ra Model để các component (giao diện) có thể dùng chung
export default () => {
  // Đường dẫn gọi vào file mock (lưu ý không có dấu / ở đầu để lách qua cái proxy của trường)
  return useInitModel<ISoVanBang>('mock-api/so-van-bang');
};
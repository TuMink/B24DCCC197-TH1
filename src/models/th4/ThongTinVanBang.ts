import useInitModel from '@/hooks/useInitModel';

export interface IThongTinVanBang {
  id?: string;
  soVaoSo?: number; // Sẽ được API tự động tạo
  soHieu: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  idQuyetDinh: string;
  [key: string]: any; // Dấu hiệu cho thấy object này sẽ chứa các trường động
}

export default () => {
  return useInitModel<IThongTinVanBang>('mock-api/thong-tin-van-bang');
};
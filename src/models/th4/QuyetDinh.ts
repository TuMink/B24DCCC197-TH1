import useInitModel from '@/hooks/useInitModel';

export interface IQuyetDinh {
  id?: string;
  _id?: string;
  soQuyetDinh: string;
  tenQuyetDinh: string;
  idSo?: string; // Khóa ngoại liên kết với Sổ Văn Bằng
}

export default () => {
  return useInitModel<IQuyetDinh>('mock-api/quyet-dinh');
};
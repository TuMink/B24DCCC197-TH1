import useInitModel from '@/hooks/useInitModel';

export interface ICauHinh {
  id?: string;
  _id?: string;
  tenTruong: string;
  kieuDuLieu: string;
}

export default () => {
  return useInitModel<ICauHinh>('mock-api/cau-hinh');
};
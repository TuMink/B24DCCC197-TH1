const DB_KEY = 'tb3_reviews';

export const getDanhSachDanhGia = async () => {
  return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
};

export const themDanhGia = async (data: any) => {
  const currentData = await getDanhSachDanhGia();
  const newData = [{ ...data, id: Date.now().toString() }, ...currentData];
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return true;
};

export const capNhatPhanHoi = async (id: string, phanHoi: string) => {
  const currentData = await getDanhSachDanhGia();
  const index = currentData.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    currentData[index].phanHoiNhanVien = phanHoi;
    localStorage.setItem(DB_KEY, JSON.stringify(currentData));
  }
  return true;
};
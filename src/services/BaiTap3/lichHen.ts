const DB_KEY = 'tb3_appointments';

export const getDanhSachLichHen = async () => {
  return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
};

export const themLichHen = async (data: any) => {
  const currentData = await getDanhSachLichHen();
  const newData = [{ ...data, id: Date.now().toString(), trangThai: 'Chờ duyệt' }, ...currentData];
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return true;
};

export const doiTrangThaiLichHen = async (id: string, trangThaiMoi: string) => {
  const currentData = await getDanhSachLichHen();
  const index = currentData.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    currentData[index].trangThai = trangThaiMoi;
    localStorage.setItem(DB_KEY, JSON.stringify(currentData));
  }
  return true;
};

// --- THÊM HÀM SỬA & XÓA ---
export const suaLichHen = async (id: string, data: any) => {
  const currentData = await getDanhSachLichHen();
  const index = currentData.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    currentData[index] = { ...currentData[index], ...data };
    localStorage.setItem(DB_KEY, JSON.stringify(currentData));
  }
  return true;
};

export const xoaLichHen = async (id: string) => {
  const currentData = await getDanhSachLichHen();
  const newData = currentData.filter((item: any) => item.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return true;
};
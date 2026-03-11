const DB_KEY = 'tb3_staffs';

export const getDanhSachNhanVien = async () => {
  return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
};

export const themNhanVien = async (data: any) => {
  const currentData = await getDanhSachNhanVien();
  const newData = [{ ...data, id: Date.now().toString() }, ...currentData];
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return true;
};

export const suaNhanVien = async (id: string, data: any) => {
  const currentData = await getDanhSachNhanVien();
  const index = currentData.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    currentData[index] = { ...currentData[index], ...data };
    localStorage.setItem(DB_KEY, JSON.stringify(currentData));
  }
  return true;
};

export const xoaNhanVien = async (id: string) => {
  const currentData = await getDanhSachNhanVien();
  const newData = currentData.filter((item: any) => item.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return true;
};
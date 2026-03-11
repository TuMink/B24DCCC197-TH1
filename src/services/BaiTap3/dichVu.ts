const DB_KEY = 'tb3_services';

export const getDanhSachDichVu = async () => {
  return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
};

export const themDichVu = async (data: any) => {
  const currentData = await getDanhSachDichVu();
  const newData = [{ ...data, id: Date.now().toString() }, ...currentData];
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return true;
};

// --- THÊM HÀM SỬA & XÓA ---
export const suaDichVu = async (id: string, data: any) => {
  const currentData = await getDanhSachDichVu();
  const index = currentData.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    currentData[index] = { ...currentData[index], ...data };
    localStorage.setItem(DB_KEY, JSON.stringify(currentData));
  }
  return true;
};

export const xoaDichVu = async (id: string) => {
  const currentData = await getDanhSachDichVu();
  const newData = currentData.filter((item: any) => item.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return true;
};                                                                                                                                                                                                                                                                                                                                                                                                      
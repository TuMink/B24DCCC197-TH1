// --- KHỞI TẠO DỮ LIỆU MẪU LẦN ĐẦU (MOCK DATA) ---
const initData = () => {
    if (!localStorage.getItem('khoiKienThuc')) {
        localStorage.setItem('khoiKienThuc', JSON.stringify([
            {id: 'KT1', maKhoi: 'KT01', tenKhoi:'Tong quan'},
            {id: 'KT2', maKhoi: 'KT02', tenKhoi:'Chuyen sau'},
        ]))
    }
    if (!localStorage.getItem('monHoc')) {
        localStorage.setItem('monHoc', JSON.stringify([
            {id: 'MH1', maMon: 'INT1430', tenMon: 'Lap trinh web', soTinChi:3},
            {id: 'MH2', maMon: 'INT1431', tenMon: 'Co so du lieu', soTinChi:3}
        ]))
    }
    // Tạm thời khởi tạo rỗng cho Câu hỏi và Đề thi
    if (!localStorage.getItem('cauHoi')) localStorage.setItem('cauHoi', JSON.stringify([]))
    if (!localStorage.getItem('deThi')) localStorage.setItem('deThi', JSON.stringify([]))
}
initData();
// --- CÁC HÀM XỬ LÝ DỮ LIỆU (MÔ PHỎNG GỌI API) ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve,ms));
// 1. Dành cho Khối kiến thức
export const getKhoiKienThuc = async () => {
    await delay(300);//
    return JSON.parse(localStorage.getItem('khoiKienThuc') || '[]');
};
export const addKhoiKienThuc = async (data:any) => {
    await delay(300);
    const current = await getKhoiKienThuc();
    const newData = {...data, id: Date.now().toString()};
    localStorage.setItem('khoiKienThuc', JSON.stringify([newData,... current]));
    return true;
}
// 2. Dành cho Môn học
export const getMonHoc = async() => {
    await delay(300);
    return JSON.parse(localStorage.getItem('monHoc') || '[]');
}
export const addMonHoc = async(data: any) => {
    await delay(300);
    const current = await getMonHoc();
    const newData = {...data, id: Date.now()};
    localStorage.setItem('khoiKienThuc', JSON.stringify([newData,...current]))
}

// 3. Dành cho Câu hỏi
export const getCauHoi = async () => {
  await delay(300);
  return JSON.parse(localStorage.getItem('cauHoi') || '[]');
};

export const addCauHoi = async (data: any) => {
  await delay(300);
  const current = await getCauHoi();
  const newData = { ...data, id: Date.now().toString() };
  localStorage.setItem('cauHoi', JSON.stringify([newData, ...current]));
  return true;
};

// 4. Dành cho Đề Thi
export const getDeThi = async () => {
  await delay(300);
  return JSON.parse(localStorage.getItem('deThi') || '[]');
};

export const addDeThi = async (data: any) => {
  await delay(300);
  const current = await getDeThi();
  const newData = { ...data, id: Date.now().toString() };
  localStorage.setItem('deThi', JSON.stringify([newData, ...current]));
  return true;
};
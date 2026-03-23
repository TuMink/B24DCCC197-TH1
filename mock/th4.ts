import { Request, Response } from 'express';

// Kho lưu trữ dữ liệu tạm thời
let soVanBangDB = [
  { id: '1', nam: 2025, soHienTai: 150 },
  { id: '2', nam: 2026, soHienTai: 0 }
];

let quyetDinhDB = [
  { id: '101', soQuyetDinh: '42/QĐ-BGD', tenQuyetDinh: 'Tốt nghiệp đợt 1 - 2025'}
];

let cauHinhDB = [
  { id: 'c1', tenTruong: 'Dân tộc', kieuDuLieu: 'String' },
  { id: 'c2', tenTruong: 'Điểm TB', kieuDuLieu: 'Number' }
];
let thongTinVanBangDB: any[] = [];

export default {
  // --- MODULE 1: SỔ VĂN BẰNG ---
  'GET /mock-api/so-van-bang/page': (req: Request, res: Response) => {
    res.send({ data: { result: soVanBangDB, total: soVanBangDB.length }, success: true });
  },
  'POST /mock-api/so-van-bang': (req: Request, res: Response) => {
    const newData = { ...req.body, id: Date.now().toString() };
    soVanBangDB.unshift(newData);
    res.send({ data: newData, success: true });
  },
  'PUT /mock-api/so-van-bang/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = soVanBangDB.findIndex(i => i.id === id);
    if (idx > -1) soVanBangDB[idx] = { ...soVanBangDB[idx], ...req.body };
    res.send({ success: true });
  },
  'DELETE /mock-api/so-van-bang/:id': (req: Request, res: Response) => {
    soVanBangDB = soVanBangDB.filter(i => i.id !== req.params.id);
    res.send({ success: true });
  },

  // --- MODULE 2: QUYẾT ĐỊNH ---
  'GET /mock-api/quyet-dinh/page': (req: Request, res: Response) => {
    res.send({ data: { result: quyetDinhDB, total: quyetDinhDB.length }, success: true });
  },
  'GET /mock-api/quyet-dinh/all': (req: Request, res: Response) => {
    res.send({ data: quyetDinhDB, success: true });
  },
  'POST /mock-api/quyet-dinh': (req: Request, res: Response) => {
    const newData = { ...req.body, id: Date.now().toString() };
    quyetDinhDB.unshift(newData);
    res.send({ data: newData, success: true });
  },
  'PUT /mock-api/quyet-dinh/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = quyetDinhDB.findIndex((i: any) => i.id === id);
    if (idx > -1) quyetDinhDB[idx] = { ...quyetDinhDB[idx], ...req.body };
    res.send({ success: true });
  },
  'DELETE /mock-api/quyet-dinh/:id': (req: Request, res: Response) => {
    quyetDinhDB = quyetDinhDB.filter((i: any) => i.id !== req.params.id);
    res.send({ success: true });
  },

  // --- MODULE 3: CẤU HÌNH BIỂU MẪU ---
  'GET /mock-api/cau-hinh/page': (req: Request, res: Response) => {
    res.send({ data: { result: cauHinhDB, total: cauHinhDB.length }, success: true });
  },
  'GET /mock-api/cau-hinh/all': (req: Request, res: Response) => {
    res.send({ data: cauHinhDB, success: true });
  },
  'POST /mock-api/cau-hinh': (req: Request, res: Response) => {
    const newData = { ...req.body, id: Date.now().toString() };
    cauHinhDB.unshift(newData);
    res.send({ data: newData, success: true });
  },
  'PUT /mock-api/cau-hinh/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = cauHinhDB.findIndex((i: any) => i.id === id);
    if (idx > -1) cauHinhDB[idx] = { ...cauHinhDB[idx], ...req.body };
    res.send({ success: true });
  },
  'DELETE /mock-api/cau-hinh/:id': (req: Request, res: Response) => {
    cauHinhDB = cauHinhDB.filter((i: any) => i.id !== req.params.id);
    res.send({ success: true });
  },
  // --- MODULE 4: THÔNG TIN VĂN BẰNG ---
  'GET /mock-api/thong-tin-van-bang/page': (req: Request, res: Response) => {
    res.send({ data: { result: thongTinVanBangDB, total: thongTinVanBangDB.length }, success: true });
  },
  'POST /mock-api/thong-tin-van-bang': (req: Request, res: Response) => {
    const body = req.body;
    let soVaoSoTudong = 0;

    // LOGIC TỰ ĐỘNG TĂNG SỐ VÀO SỔ:
    // 1. Tìm cuốn Sổ Văn Bằng đang chứa cái idQuyetDinh mà người dùng vừa chọn
    const soVanBang = soVanBangDB.find((s: any) => s.idQuyetDinh === body.idQuyetDinh);
    if (soVanBang) {
      soVanBang.soHienTai += 1; // 2. Tăng số hiện tại của sổ lên 1
      soVaoSoTudong = soVanBang.soHienTai; // 3. Lấy số đó làm "Số vào sổ" cho văn bằng này
    } else {
      soVaoSoTudong = Math.floor(Math.random() * 1000); // Back-up nếu QĐ chưa có sổ
    }
    const newData = { 
      ...body, 
      id: Date.now().toString(),
      soVaoSo: soVaoSoTudong 
    };
    
    thongTinVanBangDB.unshift(newData);
    res.send({ data: newData, success: true });
  },
  'PUT /mock-api/thong-tin-van-bang/:id': (req: Request, res: Response) => {
    const idx = thongTinVanBangDB.findIndex((i: any) => i.id === req.params.id);
    // Lưu ý: Cập nhật không cho phép sửa số vào sổ
    if (idx > -1) thongTinVanBangDB[idx] = { ...thongTinVanBangDB[idx], ...req.body, soVaoSo: thongTinVanBangDB[idx].soVaoSo };
    res.send({ success: true });
  },
  'DELETE /mock-api/thong-tin-van-bang/:id': (req: Request, res: Response) => {
    thongTinVanBangDB = thongTinVanBangDB.filter((i: any) => i.id !== req.params.id);
    res.send({ success: true });
  }
};
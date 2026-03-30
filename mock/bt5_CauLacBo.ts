import { Request, Response } from 'express';

let cauLacBoDB: any[] = [
  { id: 'clb1', tenCLB: 'CLB Âm nhạc', chuNhiem: 'Minh', hoatDong: true, ngayThanhLap: '01/01/2024', anhDaiDien: '', moTa: '<p>Xin chào</p>' },
  { id: 'clb2', tenCLB: 'CLB Lập trình', chuNhiem: 'Đồng đội', hoatDong: false, ngayThanhLap: '10/02/2024', anhDaiDien: '', moTa: '<p>Hello Code</p>' },
];

export default {
  'GET /api/bt5/cau-lac-bo/page': (req: Request, res: Response) => {
    res.send({ data: { result: cauLacBoDB, total: cauLacBoDB.length }, success: true });
  },

  'GET /api/bt5/cau-lac-bo/all': (req: Request, res: Response) => {
    res.send({ data: cauLacBoDB, success: true });
  },

  'POST /api/bt5/cau-lac-bo': (req: Request, res: Response) => {
    const newData = { ...req.body, id: Date.now().toString() };
    cauLacBoDB.unshift(newData);
    res.send({ data: newData, success: true });
  },

  'PUT /api/bt5/cau-lac-bo/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = cauLacBoDB.findIndex((i: any) => i.id === id);
    if (idx > -1) {
      cauLacBoDB[idx] = { ...cauLacBoDB[idx], ...req.body };
      res.send({ success: true });
    } else res.status(404).send({ message: 'Không tìm thấy' });
  },

  'DELETE /api/bt5/cau-lac-bo/:id': (req: Request, res: Response) => {
    cauLacBoDB = cauLacBoDB.filter((i: any) => i.id !== req.params.id);
    res.send({ success: true });
  },
};
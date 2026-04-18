import { Request, Response } from 'express';


let destinationsList = [
  {
    id: 'd1',
    name: 'Vịnh Hạ Long',
    description: 'Kỳ quan thiên nhiên thế giới.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592',
    type: 'sea',
    priceFood: 500000,
    priceLodging: 1500000,
    priceTransport: 300000,
    rating: 4.8,
    timeToVisit: 8, 
  },
  {
    id: 'd2',
    name: 'Đà Lạt',
    description: 'Thành phố ngàn hoa.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
    type: 'mountain',
    priceFood: 400000,
    priceLodging: 1000000,
    priceTransport: 500000,
    rating: 4.6,
    timeToVisit: 12, 
  }
];

export default {
  // ==========================================
  // API DÀNH CHO TUẤN MINH (TRANG NGƯỜI DÙNG)
  // ==========================================
  'GET /api/th6/destinations': (req: Request, res: Response) => {
    // Vẫn giữ hiệu ứng loading 500ms cho trang chủ
    setTimeout(() => {
      res.send({ data: destinationsList, success: true });
    }, 500);
  },

  // ==========================================
  // API DÀNH CHO KHÁNH (TRANG ADMIN QUẢN TRỊ)
  // ==========================================
  
  // 1. Lấy danh sách điểm đến (Không cần delay cho Admin)
  'GET /api/th6/admin/destinations': (req: Request, res: Response) => {
    res.send({ data: destinationsList, success: true });
  },

  // 2. Thêm mới điểm đến (POST)
  'POST /api/th6/admin/destinations': (req: Request, res: Response) => {
    const newDestination = {
      ...req.body,
      id: Date.now().toString(), // Tự sinh ID tạm
    };
    destinationsList.push(newDestination);
    res.send({ data: newDestination, success: true, message: 'Thêm mới thành công' });
  },

  // 3. Cập nhật điểm đến (PUT)
  'PUT /api/th6/admin/destinations/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = destinationsList.findIndex(item => item.id === id);
    
    if (index > -1) {
      destinationsList[index] = { ...destinationsList[index], ...req.body };
      res.send({ success: true, message: 'Cập nhật thành công' });
    } else {
      res.status(404).send({ success: false, message: 'Không tìm thấy địa điểm' });
    }
  },

  // 4. Xóa điểm đến (DELETE)
  'DELETE /api/th6/admin/destinations/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    destinationsList = destinationsList.filter(item => item.id !== id);
    res.send({ success: true, message: 'Xóa thành công' });
  },

  // 5. Thống kê theo tháng
  'GET /api/th6/admin/statistics/monthly': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: {
        month: 'Tháng 4/2026',
        totalItineraries: 145,
        totalRevenue: 250000000,
        revenueByCategory: { food: 50000000, lodging: 120000000, transport: 80000000 }
      }
    });
  },

  // 6. Thống kê địa điểm phổ biến
  'GET /api/th6/admin/statistics/popular': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: [
        { destinationId: 'd1', destinationName: 'Vịnh Hạ Long', visitCount: 89 }, 
        { destinationId: 'd2', destinationName: 'Đà Lạt', visitCount: 65 },       
        { destinationId: '3', destinationName: 'Phú Quốc', visitCount: 42 },
      ]
    });
  },
};
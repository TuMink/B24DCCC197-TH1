import { Request, Response } from 'express';

// 1. Khởi tạo một "Database" lưu trên RAM (Bắt đầu với 1 dữ liệu mẫu cho đỡ trống)
let destinationsList = [
  {
    id: '1',
    name: 'Vịnh Hạ Long',
    description: 'Di sản thiên nhiên thế giới với hàng ngàn hòn đảo kỳ vĩ.',
    imageUrl: 'https://vcdn1-dulich.vnecdn.net/2022/03/01/vinh-Ha-Long-1-1646124701.jpg',
    type: 'sea',
    priceFood: 500000,
    priceLodging: 1000000,
    priceTransport: 300000,
    rating: 5,
    timeToVisit: 4,
  }
];

export default {
  // ==========================================
  // API DÀNH CHO TUẤN MINH (TRANG NGƯỜI DÙNG)
  // ==========================================
  'GET /api/th6/destinations': (req: Request, res: Response) => {
    // Trả về danh sách để Tuấn Minh render trang chủ
    res.send({ data: destinationsList, success: true });
  },

  // ==========================================
  // API DÀNH CHO BẠN (TRANG ADMIN QUẢN TRỊ)
  // ==========================================
  
  // 1. Lấy danh sách điểm đến
  'GET /api/th6/admin/destinations': (req: Request, res: Response) => {
    res.send({ data: destinationsList, success: true });
  },

  // 2. Thêm mới điểm đến (POST)
  'POST /api/th6/admin/destinations': (req: Request, res: Response) => {
    // Lấy dữ liệu từ Form gửi lên, tự động tạo ID mới
    const newDestination = {
      ...req.body,
      id: Date.now().toString(), // Dùng timestamp làm ID tạm
    };
    
    // Đẩy vào mảng (Lưu vào database giả)
    destinationsList.push(newDestination);
    
    // Trả về thông báo thành công
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
    // Lọc bỏ phần tử có ID cần xóa
    destinationsList = destinationsList.filter(item => item.id !== id);
    res.send({ success: true, message: 'Xóa thành công' });
  },
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

  'GET /api/th6/admin/statistics/popular': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: [
        { destinationId: '1', destinationName: 'Vịnh Hạ Long', visitCount: 89 },
        { destinationId: '2', destinationName: 'Đà Lạt', visitCount: 65 },
        { destinationId: '3', destinationName: 'Phú Quốc', visitCount: 42 },
      ]
    });
  },
};
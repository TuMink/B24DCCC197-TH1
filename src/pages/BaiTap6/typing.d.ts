declare namespace BaiTap6 {
  export interface Destination {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    type: 'sea' | 'mountain' | 'city';
    priceFood: number;
    priceLodging: number;
    priceTransport: number;
    rating: number;
    timeToVisit: number; // Thời gian tham quan (giờ)
  }

  export interface ItineraryItem {
    id: string; // Khóa chính (uuid) khi thêm vào lịch trình
    destination: Destination;
    day: number;
    order: number;
  }


// 1. Dữ liệu Thống kê chi phí theo từng hạng mục
  export interface RevenueByCategory {
    food: number;
    lodging: number;
    transport: number;
  }

  // 2. Dữ liệu Thống kê tổng hợp theo tháng (Dùng vẽ Biểu đồ)
  export interface MonthlyStatistic {
    month: string; // Ví dụ: "Tháng 1", "Tháng 2"
    totalItineraries: number; // Số lượt lịch trình được tạo
    totalRevenue: number; // Tổng số tiền thu về
    revenueByCategory: RevenueByCategory; // Số tiền chi tiết theo hạng mục
  }

  // 3. Dữ liệu Địa điểm phổ biến (Dùng cho Bảng xếp hạng Admin)
  export interface PopularDestination {
    destinationId: string;
    destinationName: string;
    visitCount: number; // Số lượt được người dùng đưa vào lịch trình
  }
}

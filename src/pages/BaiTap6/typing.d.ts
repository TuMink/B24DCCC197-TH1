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
}
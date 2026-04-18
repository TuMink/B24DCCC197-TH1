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
    timeToVisit: number; 
  }

  export interface ItineraryItem {
    id: string; 
    destination: Destination;
    day: number;
    order: number;
  }
}
import { Request, Response } from 'express';

export default {
  'GET /api/th6/destinations': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        success: true,
        data: [
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
        ],
      });
    }, 500);
  },
};
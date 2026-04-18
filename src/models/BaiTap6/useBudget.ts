import { useState, useMemo } from 'react';
import { useModel } from 'umi';

// 1. Định nghĩa rõ ràng "khuôn mẫu" dữ liệu trả về của Model này
export interface IBudgetModel {
  maxBudget: number;
  setMaxBudget: React.Dispatch<React.SetStateAction<number>>;
  budgetInfo: {
    currentTotal: number;
    isExceeded: boolean;
    remaining: number;
    percentage: number;
    alertMessage: string;
  };
}

// 2. Ép kiểu trả về cho function useBudget
export default function useBudget(): IBudgetModel {
  const [maxBudget, setMaxBudget] = useState<number>(10000000);
  
  // 3. Ép kiểu rõ ràng cho itineraryList lấy từ Model của Tuấn Minh
  const { itineraryList } = useModel('BaiTap6.useItinerary') as { itineraryList: BaiTap6.ItineraryItem[] };

  const budgetInfo = useMemo(() => {
    // 4. Khai báo kiểu cho biến total và item trong vòng lặp reduce
    const currentTotal = (itineraryList || []).reduce((total: number, item: BaiTap6.ItineraryItem) => {
      const dest = item.destination;
      if (!dest) return total; // Đề phòng lỗi thiếu dữ liệu
      const cost = (dest.priceFood || 0) + (dest.priceLodging || 0) + (dest.priceTransport || 0);
      return total + cost;
    }, 0);

    const isExceeded = currentTotal > maxBudget;
    const remaining = maxBudget - currentTotal;
    const percentage = maxBudget > 0 ? Math.min(Math.round((currentTotal / maxBudget) * 100), 100) : 0;

    const alertMessage = isExceeded
      ? `Cảnh báo: Lịch trình đã vượt ngân sách ${Math.abs(remaining).toLocaleString('vi-VN')} VNĐ!`
      : `Ngân sách an toàn. Số dư còn lại: ${remaining.toLocaleString('vi-VN')} VNĐ`;

    return {
      currentTotal,
      isExceeded,
      remaining,
      percentage,
      alertMessage
    };
  }, [maxBudget, itineraryList]);

  return { 
    maxBudget, 
    setMaxBudget,
    budgetInfo
  };
}
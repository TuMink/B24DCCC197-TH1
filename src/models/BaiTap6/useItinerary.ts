import { useState } from 'react';

export default function useItinerary() {
  const [itineraryList, setItineraryList] = useState<BaiTap6.ItineraryItem[]>([]);
  const [totalDays, setTotalDays] = useState<number>(3); // Mặc định chuyến đi 3 ngày

  // Thêm điểm đến mới (Mặc định ném vào Ngày 1)
  const addDestination = (item: BaiTap6.ItineraryItem) => {
    setItineraryList((prev) => [...prev, item]);
  };

  // Xóa điểm đến
  const removeDestination = (id: string) => {
    setItineraryList((prev) => prev.filter((item) => item.id !== id));
  };

  // Di chuyển điểm đến sang ngày khác (Dùng cho Kéo thả)
  const moveDestination = (id: string, targetDay: number) => {
    setItineraryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, day: targetDay } : item))
    );
  };

  // Thêm ngày mới vào lịch trình
  const addDay = () => setTotalDays((prev) => prev + 1);

  return {
    itineraryList,
    totalDays,
    addDay,
    addDestination,
    removeDestination,
    moveDestination,
  };
}
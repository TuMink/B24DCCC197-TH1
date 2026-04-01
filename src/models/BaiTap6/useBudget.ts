import { useState } from 'react';

export default function useBudget() {
  const [maxBudget, setMaxBudget] = useState<number>(10000000);
  
  // Thành viên 2 sẽ import itineraryList từ useItinerary vào đây để tính toán sau
  return { maxBudget, setMaxBudget };
}
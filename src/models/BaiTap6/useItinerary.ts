import { useState } from 'react';

export default function useItinerary() {
  const [itineraryList, setItineraryList] = useState<BaiTap6.ItineraryItem[]>([]);

  const addDestination = (item: BaiTap6.ItineraryItem) => {
    setItineraryList((prev) => [...prev, item]);
  };

  const removeDestination = (id: string) => {
    setItineraryList((prev) => prev.filter(item => item.id !== id));
  };

  return { itineraryList, addDestination, removeDestination };
}
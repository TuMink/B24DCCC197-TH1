import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Empty } from 'antd';
import { useModel } from 'umi';
import { getDestinations } from '@/services/BaiTap6/destination';
import DestinationCard from './components/DestinationCard';
import FilterPanel from './components/FilterPanel'; // Import Component Bộ lọc
import styles from './style.less';

const HomePage = () => {
  // Mảng gốc không bao giờ bị thay đổi
  const [originalDestinations, setOriginalDestinations] = useState<BaiTap6.Destination[]>([]);
  // Mảng dùng để vẽ ra màn hình (sẽ thay đổi khi filter)
  const [displayDestinations, setDisplayDestinations] = useState<BaiTap6.Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const { addDestination } = useModel('BaiTap6.useItinerary');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDestinations();
      setOriginalDestinations(data);
      setDisplayDestinations(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách điểm đến!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItinerary = (destination: BaiTap6.Destination) => {
    const newItem: BaiTap6.ItineraryItem = {
      id: Date.now().toString(),
      destination,
      day: 1,
      order: 1,
    };
    addDestination(newItem);
    message.success(`Đã thêm ${destination.name} vào lịch trình!`);
  };

  // Logic xử lý khi người dùng thao tác trên Bộ lọc
  const handleFilter = (filters: any) => {
    let filtered = [...originalDestinations]; // Copy từ mảng gốc

    // 1. Lọc theo loại hình (Biển/Núi/Thành phố)
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // 2. Lọc theo Tổng chi phí (Ăn + Ở + Di chuyển) <= maxPrice
    if (filters.maxPrice) {
      filtered = filtered.filter(
        item => (item.priceFood + item.priceLodging + item.priceTransport) <= filters.maxPrice
      );
    }

    // 3. Lọc theo Đánh giá >= minRating
    if (filters.minRating) {
      filtered = filtered.filter(item => item.rating >= filters.minRating);
    }

    // Cập nhật lại mảng hiển thị
    setDisplayDestinations(filtered);
  };

  return (
    <div className={styles.container}>
      <h2>Khám phá điểm đến</h2>
      
      {/* Nhúng bộ lọc vào đây */}
      <FilterPanel onFilterChange={handleFilter} />

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {displayDestinations.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <DestinationCard item={item} onAdd={handleAddItinerary} />
            </Col>
          ))}
        </Row>

        {/* Xử lý UI khi lọc không ra kết quả nào */}
        {displayDestinations.length === 0 && !loading && (
          <Empty description="Không tìm thấy điểm đến nào phù hợp với bộ lọc" style={{ marginTop: 50 }} />
        )}
      </Spin>
    </div>
  );
};

export default HomePage;
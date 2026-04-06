import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Empty, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { getDestinations } from '@/services/BaiTap6/destination';
import DestinationCard from './components/DestinationCard';
import FilterPanel from './components/FilterPanel';
import styles from './style.less';

const HomePage = () => {
  const [originalDestinations, setOriginalDestinations] = useState<BaiTap6.Destination[]>([]);
  const [displayDestinations, setDisplayDestinations] = useState<BaiTap6.Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy data từ Model
  const { addDestination, itineraryList, totalDays } = useModel('BaiTap6.useItinerary');

  // VÁ LỖI UNDEFINED: Đặt giá trị mặc định là 3 nếu model chưa kịp cập nhật
  const safeTotalDays = totalDays || 3;

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

  // Tách riêng logic xử lý việc thêm vào mảng (sau khi đã pass các bài kiểm tra)
  const processAddDestination = (destination: BaiTap6.Destination) => {
    let targetDay = -1;

    // Quét tìm ngày trống
    for (let i = 1; i <= safeTotalDays; i++) {
      const dayItems = itineraryList.filter((item) => item.day === i);
      const totalHours = dayItems.reduce((sum, item) => sum + item.destination.timeToVisit, 0);

      if (totalHours + destination.timeToVisit <= 24) {
        targetDay = i;
        break;
      }
    }

    if (targetDay === -1) {
      message.error(`Tất cả ${safeTotalDays} ngày đều đã kín lịch! Hãy sang tab Lịch trình thêm ngày mới.`);
      return;
    }

    const newItem: BaiTap6.ItineraryItem = {
      id: Date.now().toString(),
      destination,
      day: targetDay,
      order: Date.now(),
    };
    
    addDestination(newItem);
    message.success(`Đã tự động xếp ${destination.name} vào Ngày ${targetDay}!`);
  };

  // Logic Nút bấm "Thêm vào lịch trình"
  const handleAddItinerary = (destination: BaiTap6.Destination) => {
    // 1. Kiểm tra xem địa điểm này đã có trong danh sách lịch trình chưa
    const isDuplicate = itineraryList.some((item) => item.destination.id === destination.id);

    // 2. Nếu đã có thì bật hộp thoại cảnh báo
    if (isDuplicate) {
      Modal.confirm({
        title: 'Cảnh báo trùng lặp địa điểm!',
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }}/>,
        content: `Bạn đã chọn đi ${destination.name} trong chuyến đi này rồi. Bạn có chắc chắn muốn đi lại nơi này không?`,
        okText: 'Vẫn thêm',
        cancelText: 'Hủy bỏ',
        onOk() {
          // Bấm OK thì mới chạy hàm thêm
          processAddDestination(destination);
        },
        onCancel() {
          // Bấm Hủy thì không làm gì cả
          message.info('Đã hủy thêm địa điểm.');
        },
      });
    } else {
      // 3. Nếu chưa có thì cứ thế thêm thẳng vào luôn
      processAddDestination(destination);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = [...originalDestinations];
    if (filters.type) filtered = filtered.filter(item => item.type === filters.type);
    if (filters.maxPrice) {
      filtered = filtered.filter(item => (item.priceFood + item.priceLodging + item.priceTransport) <= filters.maxPrice);
    }
    if (filters.minRating) filtered = filtered.filter(item => item.rating >= filters.minRating);
    setDisplayDestinations(filtered);
  };

  return (
    <div className={styles.container}>
      <h2>Khám phá điểm đến</h2>
      <FilterPanel onFilterChange={handleFilter} />

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {displayDestinations.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <DestinationCard item={item} onAdd={handleAddItinerary} />
            </Col>
          ))}
        </Row>
        {displayDestinations.length === 0 && !loading && (
          <Empty description="Không tìm thấy điểm đến nào phù hợp với bộ lọc" style={{ marginTop: 50 }} />
        )}
      </Spin>
    </div>
  );
};

export default HomePage;
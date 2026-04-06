import React from 'react';
import { Row, Col, Card, Button, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import styles from './style.less';

const { Title, Text } = Typography;

const ItineraryPage = () => {
  const { itineraryList, totalDays, addDay, removeDestination, moveDestination } = useModel('BaiTap6.useItinerary');

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('draggingItemId', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // VÁ LOGIC: Kiểm tra thời gian trước khi cho thả thẻ
  const handleDrop = (e: React.DragEvent, targetDay: number) => {
    const itemId = e.dataTransfer.getData('draggingItemId');
    if (itemId) {
      const draggedItem = itineraryList.find(item => item.id === itemId);
      if (!draggedItem) return;

      // Tính tổng thời gian các thẻ ĐANG CÓ trong ngày mục tiêu (không tính chính nó nếu nó đang ở sẵn cột đó)
      const currentDayItems = itineraryList.filter(item => item.day === targetDay && item.id !== itemId);
      const totalHoursInTargetDay = currentDayItems.reduce((sum, item) => sum + item.destination.timeToVisit, 0);

      // Nếu Tổng giờ cũ + Giờ của thẻ chuẩn bị thả > 24h => Chặn!
      if (totalHoursInTargetDay + draggedItem.destination.timeToVisit > 24) {
        message.error(`Ngày ${targetDay} đã kín lịch! Không thể vượt quá 24h.`);
        return; // Dừng luôn, không gọi hàm moveDestination
      }

      moveDestination(itemId, targetDay);
      message.success(`Đã xếp vào Ngày ${targetDay}`);
    }
  };

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Lịch trình chuyến đi</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={addDay} size="large">
          Thêm Ngày
        </Button>
      </div>

      <Row gutter={16} wrap={false} className={styles.boardScroll}>
        {daysArray.map((day) => {
          const dayItems = itineraryList.filter((item) => item.day === day);
          
          const dayCost = dayItems.reduce((sum, item) => 
            sum + item.destination.priceFood + item.destination.priceLodging + item.destination.priceTransport, 0
          );
          
          // Thêm tính tổng giờ để hiển thị UI
          const dayHours = dayItems.reduce((sum, item) => sum + item.destination.timeToVisit, 0);
          const isOverloaded = dayHours > 20; // Nếu xếp > 20h/ngày thì cảnh báo vàng

          return (
            <Col flex="0 0 320px" key={day}>
              <Card 
                title={`Ngày ${day}`} 
                className={styles.dayColumn}
                // Nâng cấp Header cột: Hiện Tổng tiền và Tổng giờ
                extra={
                  <div style={{ textAlign: 'right' }}>
                    <Text type="success" strong>{formatPrice(dayCost)}</Text>
                    <br />
                    <Text type={isOverloaded ? 'warning' : 'secondary'} style={{ fontSize: 12 }}>
                      <ClockCircleOutlined /> {dayHours}h / 24h
                    </Text>
                  </div>
                }
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={styles.dropZone}>
                  {dayItems.length === 0 ? (
                    <div className={styles.emptyText}>Kéo thả điểm đến vào đây</div>
                  ) : (
                    dayItems.map((item) => {
                      const dest = item.destination;
                      return (
                        <Card
                          key={item.id}
                          size="small"
                          className={styles.draggableCard}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          extra={
                            <Popconfirm title="Xóa khỏi lịch trình?" onConfirm={() => removeDestination(item.id)}>
                              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                            </Popconfirm>
                          }
                        >
                          <Card.Meta
                            title={dest.name}
                            description={
                              <div>
                                <div><ClockCircleOutlined /> {dest.timeToVisit} giờ</div>
                                <div style={{ marginTop: 4 }}>
                                  <DollarOutlined /> {formatPrice(dest.priceFood + dest.priceLodging + dest.priceTransport)}
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      );
                    })
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ItineraryPage;
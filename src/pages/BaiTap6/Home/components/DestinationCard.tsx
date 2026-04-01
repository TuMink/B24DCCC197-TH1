import React from 'react';
import { Card, Rate, Tag, Button, Typography, Space } from 'antd';
// Bổ sung thêm CarOutlined cho icon Đi lại
import { EnvironmentOutlined, DollarOutlined, CarOutlined } from '@ant-design/icons'; 
import styles from '../style.less';

const { Text } = Typography;

interface Props {
  item: BaiTap6.Destination;
  onAdd: (item: BaiTap6.Destination) => void;
}

const DestinationCard: React.FC<Props> = ({ item, onAdd }) => {
  const formatPrice = (price: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const typeColor: any = {
    sea: 'blue',
    mountain: 'green',
    city: 'gold',
  };

  const typeLabel: any = {
    sea: 'Biển',
    mountain: 'Núi',
    city: 'Thành phố',
  };

  return (
    <Card
      hoverable
      cover={<img alt={item.name} src={item.imageUrl} className={styles.cardImg} />}
      actions={[
        <Button type="primary" onClick={() => onAdd(item)}>Thêm vào lịch trình</Button>
      ]}
      className={styles.card}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{item.name}</span>
            <Tag color={typeColor[item.type]}>{typeLabel[item.type]}</Tag>
          </div>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
            <Text type="secondary" ellipsis={{ tooltip: item.description }}>
              {item.description}
            </Text>
            <Rate disabled defaultValue={item.rating} allowHalf style={{ fontSize: 14 }} />
            <div>
              <EnvironmentOutlined /> Tham quan: {item.timeToVisit} giờ
            </div>
            <div>
              <DollarOutlined /> Ăn: <Text strong>{formatPrice(item.priceFood)}</Text> | Ở: <Text strong>{formatPrice(item.priceLodging)}</Text>
            </div>
            {/* Thêm hiển thị Tiền đi lại ở đây */}
            <div>
              <CarOutlined /> Đi lại: <Text strong>{formatPrice(item.priceTransport)}</Text>
            </div>
          </Space>
        }
      />
    </Card>
  );
};

export default DestinationCard;
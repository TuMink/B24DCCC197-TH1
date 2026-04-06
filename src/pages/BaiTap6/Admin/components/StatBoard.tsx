import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, List, Typography } from 'antd';
import { FireOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { getAdminDestinations } from '@/services/BaiTap6/admin';

const StatBoard: React.FC = () => {
  // 1. "Móc" vào Global State của Tuấn Minh và Ngân sách của bạn để lấy data Real-time
  const { itineraryList } = useModel('BaiTap6.useItinerary') as { itineraryList: any[] };
  const { budgetInfo } = useModel('BaiTap6.useBudget') as any;

  // 2. State để lưu toàn bộ danh sách điểm đến hiện có trong hệ thống
  const [allDestinations, setAllDestinations] = useState<any[]>([]);

  // Lấy danh sách điểm đến ngay khi vào trang Admin
  useEffect(() => {
    getAdminDestinations().then(res => {
      setAllDestinations(res?.data || []);
    });
  }, []); // Lưu ý: Trong thực tế có thể gọi lại hàm này khi thêm/sửa/xóa điểm đến để cập nhật Top Hot

  // 3. TỰ ĐỘNG TÍNH TOÁN (Tự động chạy lại mỗi khi có dữ liệu mới)
  const dynamicStats = useMemo(() => {
    // A. Lọc ra Top 3 địa điểm HOT nhất (Dựa vào số sao - Rating cao nhất)
    const topDestinations = [...allDestinations]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Xếp giảm dần theo rating
      .slice(0, 3); // Cắt lấy 3 ông đứng đầu

    return {
      // B. Doanh thu: Chính là tổng tiền của lịch trình hiện tại (từ useBudget)
      currentRevenue: budgetInfo?.currentTotal || 0,
      
      // C. Số lượt: Đếm số lượng điểm đến đang có trong lịch trình hiện tại
      totalPlacesInItinerary: (itineraryList || []).length,
      
      topDestinations
    };
  }, [itineraryList, budgetInfo, allDestinations]);

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        {/* Cột 1: Số điểm đến trong Lịch trình hiện tại */}
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Điểm đến trong Lịch trình" 
              value={dynamicStats.totalPlacesInItinerary} 
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />} 
              suffix="điểm"
            />
          </Card>
        </Col>

        {/* Cột 2: Doanh thu thực tế từ Lịch trình */}
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Tổng chi phí Lịch trình" 
              value={dynamicStats.currentRevenue} 
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />} 
              suffix="VNĐ"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Card>
        </Col>

        {/* Cột 3: Top địa điểm (Lấy theo Rating thật từ Khám phá điểm đến) */}
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              <FireOutlined style={{ color: '#faad14', marginRight: 8 }} /> 
              Top Địa điểm Hot (Theo Rating)
            </Typography.Text>
            <List
              size="small"
              dataSource={dynamicStats.topDestinations}
              locale={{ emptyText: 'Chưa có điểm đến nào' }}
              renderItem={item => (
                <List.Item style={{ padding: '4px 0', border: 'none' }}>
                  <Typography.Text>{item.name}</Typography.Text>
                  <Typography.Text type="warning">⭐ {item.rating}/5</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatBoard;
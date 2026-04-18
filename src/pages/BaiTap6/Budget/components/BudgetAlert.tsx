import React from 'react';
import { Card, Row, Col, Statistic, Alert } from 'antd';
import { useModel } from 'umi';
import styles from '../style.less';

const BudgetAlert: React.FC = () => {
  // Lấy dữ liệu từ Global State
  const { maxBudget, budgetInfo } = useModel('BaiTap6.useBudget');

  return (
    <Card className={styles.cardContainer} title="Tổng quan Ngân sách">
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Statistic 
            title="Ngân sách tối đa" 
            value={maxBudget} 
            suffix="VNĐ" 
            valueStyle={{ color: '#1890ff' }} // Màu xanh dương
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Đã chi tiêu (Dự kiến)"
            value={budgetInfo.currentTotal}
            suffix="VNĐ"
            valueStyle={{ color: budgetInfo.isExceeded ? '#cf1322' : '#3f8600' }} // Đỏ nếu vượt, Xanh lá nếu an toàn
          />
        </Col>
      </Row>
      
      {/* Hiển thị câu cảnh báo tự động */}
      <Alert
        message={budgetInfo.alertMessage}
        type={budgetInfo.isExceeded ? 'error' : 'success'}
        showIcon
      />
    </Card>
  );
};

export default BudgetAlert;
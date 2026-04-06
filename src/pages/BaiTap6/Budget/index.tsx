import React from 'react';
import { Row, Col, InputNumber, Form, Card } from 'antd';
import { useModel } from 'umi';
import BudgetAlert from './components/BudgetAlert';
import BudgetChart from './components/BudgetChart';
import styles from './style.less';

const BudgetPage: React.FC = () => {
  const { maxBudget, setMaxBudget } = useModel('BaiTap6.useBudget');

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Quản lý Ngân sách Lịch trình</h2>

      {/* Card nhập ngân sách */}
      <Card className={styles.cardContainer} style={{ marginBottom: 24 }}>
        <Form layout="inline">
          <Form.Item label="Thiết lập Ngân sách tối đa (VNĐ)">
            <InputNumber
              style={{ width: 250 }}
              min={0}
              step={500000} // Mỗi lần bấm tăng/giảm 500k
              value={maxBudget}
              onChange={(value) => setMaxBudget(value || 0)}
              // Format để số hiển thị có dấu phẩy (VD: 10,000,000)
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* Chia cột: 1 bên cảnh báo, 1 bên biểu đồ */}
      <Row gutter={24}>
        <Col xs={24} md={14}>
          <BudgetAlert />
        </Col>
        <Col xs={24} md={10}>
          <BudgetChart />
        </Col>
      </Row>
    </div>
  );
};

export default BudgetPage;
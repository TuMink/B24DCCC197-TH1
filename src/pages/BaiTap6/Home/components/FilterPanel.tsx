import React from 'react';
import { Card, Form, Select, InputNumber, Rate, Row, Col } from 'antd';

const { Option } = Select;

interface FilterValues {
  type?: string;
  maxPrice?: number;
  minRating?: number;
}

interface Props {
  onFilterChange: (values: FilterValues) => void;
}

const FilterPanel: React.FC<Props> = ({ onFilterChange }) => {
  const [form] = Form.useForm();

  const handleValuesChange = (_: any, allValues: FilterValues) => {
    onFilterChange(allValues);
  };

  return (
    <Card style={{ marginBottom: 24, borderRadius: 8 }}>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={{ maxPrice: 5000000, minRating: 0 }}
      >
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Form.Item name="type" label="Loại hình">
              <Select placeholder="Tất cả" allowClear>
                <Option value="sea">Biển</Option>
                <Option value="mountain">Núi</Option>
                <Option value="city">Thành phố</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} md={8}>
            <Form.Item name="maxPrice" label="Tổng chi phí tối đa (VNĐ)">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={100000}
                placeholder="Nhập số tiền..."
                // Thêm check an toàn: Có value thì mới replace
                formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                parser={(value) => {
                  const num = value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0;
                  return num as any;
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item name="minRating" label="Đánh giá tối thiểu">
              <Rate allowHalf />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FilterPanel;
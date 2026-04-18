import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import { addDestination, updateDestination } from '@/services/BaiTap6/admin';

interface Props {
  visible: boolean;
  setVisible: (v: boolean) => void;
  record: BaiTap6.Destination | null;
  reload: () => void;
}

const DestinationForm: React.FC<Props> = ({ visible, setVisible, record, reload }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Tự động đổ dữ liệu khi mở Form
  useEffect(() => {
    if (visible) {
      if (record?.id) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
        form.setFieldsValue({ type: 'city', rating: 5, timeToVisit: 2 }); // Giá trị mặc định
      }
    }
  }, [visible, record, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (record?.id) {
        await updateDestination(record.id, values);
        message.success('Cập nhật điểm đến thành công!');
      } else {
        await addDestination(values);
        message.success('Thêm điểm đến mới thành công!');
      }
      
      setVisible(false);
      reload();
    } catch (error) {
      console.log('Lỗi điền form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={record?.id ? "Chỉnh sửa Điểm đến" : "Thêm mới Điểm đến"}
      visible={visible} // Lưu ý: Ở bản Antd mới, visible đổi thành open. Nếu báo đỏ, bạn đổi lại thành visible nhé.
      onOk={handleSave}
      onCancel={() => setVisible(false)}
      confirmLoading={loading}
      width={800}
      destroyOnClose
      okText="Lưu dữ liệu"
      cancelText="Hủy bỏ"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {/* CỘT TRÁI: Thông tin cơ bản */}
          <Col span={12}>
            <Form.Item name="name" label="Tên địa điểm" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input placeholder="Vịnh Hạ Long, Bà Nà Hills..." />
            </Form.Item>

            <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="sea">Biển (Sea)</Select.Option>
                <Select.Option value="mountain">Núi (Mountain)</Select.Option>
                <Select.Option value="city">Thành phố (City)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="imageUrl" label="Link Ảnh (URL)" rules={[{ required: true, message: 'Vui lòng nhập link ảnh!' }]}>
              <Input placeholder="https://domain.com/anh.jpg" />
            </Form.Item>

            <Form.Item name="rating" label="Đánh giá (Sao)">
              <InputNumber min={1} max={5} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* CỘT PHẢI: Thông tin chi phí & Thời gian */}
          <Col span={12}>
            <Form.Item name="priceFood" label="Chi phí Ăn uống (VNĐ)" rules={[{ required: true }]}>
              <InputNumber min={0} step={50000} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>

            <Form.Item name="priceLodging" label="Chi phí Lưu trú (VNĐ)" rules={[{ required: true }]}>
              <InputNumber min={0} step={100000} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>

            <Form.Item name="priceTransport" label="Chi phí Di chuyển (VNĐ)" rules={[{ required: true }]}>
              <InputNumber min={0} step={50000} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>

            <Form.Item name="timeToVisit" label="Thời gian tham quan (Giờ)">
              <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* DÒNG CUỐI: Mô tả dài */}
          <Col span={24}>
            <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true }]}>
              <Input.TextArea rows={3} placeholder="Viết vài dòng giới thiệu về địa điểm này..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DestinationForm;
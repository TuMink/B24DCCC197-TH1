import React, { useEffect } from 'react';
import { Modal, Form, Select, Typography } from 'antd';

const { Text } = Typography;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (newCauLacBoId: string) => void;
  count: number; // Số lượng thành viên đang được chọn để đổi
}

const ModalDoiCLB: React.FC<Props> = ({ visible, onCancel, onSubmit, count }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) form.resetFields();
  }, [visible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.newCauLacBoId);
    } catch (error) {}
  };

  return (
    <Modal title="Đổi Câu Lạc Bộ" visible={visible} onOk={handleOk} onCancel={onCancel} okText="Xác nhận chuyển" cancelText="Hủy">
      <div style={{ marginBottom: 16 }}>
        <Text>Bạn đang thực hiện chuyển CLB cho <Text strong type="danger">{count}</Text> thành viên.</Text>
      </div>
      <Form form={form} layout="vertical">
        <Form.Item 
          name="newCauLacBoId" 
          label="Chọn Câu lạc bộ chuyển đến" 
          rules={[{ required: true, message: 'Vui lòng chọn Câu lạc bộ đích!' }]}
        >
          <Select placeholder="-- Chọn CLB --">
            <Select.Option value="CLB_01">CLB Âm nhạc</Select.Option>
            <Select.Option value="CLB_02">CLB Thể thao</Select.Option>
            <Select.Option value="CLB_03">CLB Học thuật</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDoiCLB;
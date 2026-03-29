// Đường dẫn: src/pages/BaiTap5/DonDangKy/ModalTuChoi.tsx
import React from 'react';
import { Modal, Form, Input } from 'antd';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (lyDo: string) => void;
}

const ModalTuChoi: React.FC<Props> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.lyDo);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  return (
    <Modal
      title="Nhập lý do từ chối"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Xác nhận từ chối"
      okButtonProps={{ danger: true }}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="lyDo"
          label="Lý do từ chối"
          rules={[{ required: true, message: 'Bắt buộc phải nhập lý do từ chối!' }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập lý do để ứng viên biết..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalTuChoi;
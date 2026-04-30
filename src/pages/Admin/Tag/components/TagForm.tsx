import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { Tag } from '../../../../models/blog';

interface TagFormProps {
  visible: boolean;
  onOk: (values: Partial<Tag>) => void;
  onCancel: () => void;
  initialValues?: Partial<Tag>;
}

const TagForm: React.FC<TagFormProps> = ({ visible, onOk, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      visible={visible} // Dùng visible cho bản 4.21
      title={initialValues?.name ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
      onOk={() => form.submit()}
      onCancel={onCancel}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onOk}>
        <Form.Item 
          name="name" 
          label="Tên thẻ" 
          rules={[{ required: true, message: 'Vui lòng nhập tên thẻ!' }]}
        >
          <Input placeholder="Ví dụ: ReactJS, Frontend, UI/UX..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagForm;
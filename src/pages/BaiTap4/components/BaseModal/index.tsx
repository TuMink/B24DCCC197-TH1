import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';

interface Props {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: any;
  children: React.ReactNode;
}

const BaseModal: React.FC<Props> = ({ title, visible, onCancel, onFinish, initialValues, children }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      initialValues ? form.setFieldsValue(initialValues) : form.resetFields();
    }
  }, [visible, initialValues]);

  return (
    <Modal
      title={title}
      visible={visible} // Dùng visible cho Antd v4
      onOk={() => form.submit()}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {children}
      </Form>
    </Modal>
  );
};

export default BaseModal;
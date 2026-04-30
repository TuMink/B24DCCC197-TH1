import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Radio } from 'antd';
import * as blogService from '../../../../services/blog';
import type { BlogPost } from '../../../../models/blog';

interface PostFormProps {
  visible: boolean;
  onOk: (values: Partial<BlogPost>) => void;
  onCancel: () => void;
  initialValues?: Partial<BlogPost>;
}

const PostForm: React.FC<PostFormProps> = ({ visible, onOk, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [availableTags, setAvailableTags] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (visible) {
      // Load tags gợi ý
      blogService.getTags().then(tags => {
        setAvailableTags(tags.map(t => ({ label: t.name, value: t.name })));
      });
      
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.setFieldsValue({ status: 'published', tags: [] });
      }
    }
  }, [visible, initialValues, form]);

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.title && !initialValues?.id) {
      const slug = changedValues.title.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      form.setFieldsValue({ slug });
    }
  };

  return (
    <Modal
      visible={visible} // Dùng visible cho AntD 4.21
      title={initialValues?.id ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
      onOk={() => form.submit()}
      onCancel={onCancel}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onOk} onValuesChange={handleValuesChange}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}><Input /></Form.Item>
        <Form.Item name="slug" label="Slug (URL)" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="content" label="Nội dung Markdown" rules={[{ required: true }]}><Input.TextArea rows={8} /></Form.Item>
        <Form.Item name="coverUrl" label="Link ảnh bìa"><Input placeholder="https://..." /></Form.Item>
        <Form.Item name="tags" label="Gán thẻ"><Select mode="tags" options={availableTags} /></Form.Item>
        <Form.Item name="status" label="Trạng thái"><Radio.Group options={[{label:'Đã đăng',value:'published'},{label:'Nháp',value:'draft'}]} /></Form.Item>
      </Form>
    </Modal>
  );
};

export default PostForm;
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message } from 'antd';
import { getKhoiKienThuc, addKhoiKienThuc } from '@/services/BaiTap2/Bai2/api';

const KhoiKienThuc = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Load dữ liệu
  const loadData = async () => {
    setLoading(true);
    const res = await getKhoiKienThuc();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // Xử lý khi bấm Lưu (Thêm mới)
  const handleAdd = async (values: any) => {
    await addKhoiKienThuc(values);
    message.success('Thêm khối kiến thức thành công!');
    setIsModalVisible(false);
    form.resetFields();
    loadData(); // Tải lại bảng
  };

  const columns = [
    { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60, align: 'center' as const },
    { title: 'Mã khối', dataIndex: 'maKhoi', key: 'maKhoi' },
    { title: 'Tên khối kiến thức', dataIndex: 'tenKhoi', key: 'tenKhoi' },
  ];

  return (
    <Card 
      title="Danh mục Khối kiến thức" 
      extra={<Button type="primary" onClick={() => setIsModalVisible(true)}>+ Thêm mới</Button>}
    >
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal 
        title="Thêm Khối kiến thức" 
        visible={isModalVisible} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="maKhoi" label="Mã khối" rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}>
            <Input placeholder="Ví dụ: KT03" />
          </Form.Item>
          <Form.Item name="tenKhoi" label="Tên khối kiến thức" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Ví dụ: Cơ sở ngành" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KhoiKienThuc;
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { getMonHoc, addMonHoc } from '@/services/BaiTap2/Bai2/api';

const MonHoc = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    const res = await getMonHoc();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (values: any) => {
    await addMonHoc(values);
    message.success('Thêm môn học thành công!');
    setIsModalVisible(false);
    form.resetFields();
    loadData();
  };

  const columns = [
    { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60, align: 'center' as const },
    { title: 'Mã môn', dataIndex: 'maMon', key: 'maMon' },
    { title: 'Tên môn học', dataIndex: 'tenMon', key: 'tenMon' },
    { title: 'Số tín chỉ', dataIndex: 'soTinChi', key: 'soTinChi', align: 'center' as const },
  ];

  return (
    <Card 
      title="Danh mục Môn học" 
      extra={<Button type="primary" onClick={() => setIsModalVisible(true)}>+ Thêm môn học</Button>}
    >
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal 
        title="Thêm Môn học" 
        visible={isModalVisible} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="maMon" label="Mã môn" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: INT1434" />
          </Form.Item>
          <Form.Item name="tenMon" label="Tên môn học" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Lập trình Web" />
          </Form.Item>
          <Form.Item name="soTinChi" label="Số tín chỉ" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MonHoc;
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Space, Popconfirm } from 'antd';
import { useModel } from 'umi';

const DichVu = () => {
  // Lấy đủ bộ công cụ từ Model
  const { danhSach, loading, handleAddDichVu, handleEditDichVu, handleDeleteDichVu } = useModel('baitap3.dichVu');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Mở modal Thêm mới
  const handleOpenAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal Sửa
  const handleOpenEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record); // Đổ dữ liệu cũ vào form
    setIsModalVisible(true);
  };

  // Xóa dịch vụ
  const handleXoa = async (id: string) => {
    await handleDeleteDichVu(id);
    message.success('Đã xóa dịch vụ!');
  };

  // Xử lý Lưu (Cả thêm và sửa)
  const handleLuu = async (values: any) => {
    if (editingId) {
      await handleEditDichVu(editingId, values);
      message.success('Cập nhật dịch vụ thành công!');
    } else {
      await handleAddDichVu(values);
      message.success('Thêm mới dịch vụ thành công!');
    }
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60, align: 'center' as const },
    { title: 'Tên dịch vụ', dataIndex: 'tenDichVu', key: 'tenDichVu', strong: true },
    { title: 'Giá tiền (VNĐ)', dataIndex: 'giaTien', key: 'giaTien', render: (val: number) => val?.toLocaleString() },
    { title: 'Thời gian (Phút)', dataIndex: 'thoiGianThucHien', key: 'thoiGianThucHien', align: 'center' as const },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (record: any) => (
        <Space>
          <Button type="link" onClick={() => handleOpenEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa dịch vụ này?" onConfirm={() => handleXoa(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Quản lý Nhân viên & Dịch vụ" 
      extra={<Button type="primary" onClick={handleOpenAdd}>+ Thêm Dịch vụ</Button>}
    >
      <Table dataSource={danhSach} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal title={editingId ? "Sửa Dịch vụ" : "Thêm Dịch vụ mới"} visible={isModalVisible} onOk={() => form.submit()} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical" onFinish={handleLuu}>
          <Form.Item name="tenDichVu" label="Tên dịch vụ" rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}>
            <Input placeholder="VD: Cắt tóc nam, Gội đầu..." />
          </Form.Item>
          <Form.Item name="giaTien" label="Giá tiền (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
            <InputNumber style={{ width: '100%' }} min={0} step={10000} />
          </Form.Item>
          <Form.Item name="thoiGianThucHien" label="Thời gian thực hiện (Phút)" rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}>
            <InputNumber style={{ width: '100%' }} min={5} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DichVu;
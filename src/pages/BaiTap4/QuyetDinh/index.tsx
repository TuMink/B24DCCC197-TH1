import React, { useEffect } from 'react';
import { Card, Table, Button, Space, Popconfirm, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import BaseModal from '../components/BaseModal'; // Đảm bảo BaseModal của bạn nằm đúng ở thư mục components

const QuyetDinh = () => {
  // Lấy hàm và biến từ Model QuyetDinh (Chữ hoa chữ thường chuẩn 100%)
  const {
    danhSach,
    loading,
    getModel,
    postModel,
    putModel,
    deleteModel,
    visibleForm,
    setVisibleForm,
    edit,
    record,
    handleEdit,
  } = useModel('th4.QuyetDinh');

  useEffect(() => {
    getModel();
  }, []);

  const onFinish = async (values: any) => {
    if (edit && record) {
      // Đã thêm dấu ! để TypeScript không bắt bẻ lỗi undefined id
      await putModel(record.id!, values);
    } else {
      await postModel(values);
    }
  };

  const columns = [
    { title: 'Số Quyết Định', dataIndex: 'soQuyetDinh', key: 'soQuyetDinh', width: 200 },
    { title: 'Tên Quyết Định', dataIndex: 'tenQuyetDinh', key: 'tenQuyetDinh' },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      width: 150,
      render: (_: any, rec: any) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(rec)} size="small" />
          <Popconfirm title="Xóa quyết định này?" onConfirm={() => deleteModel(rec.id!)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="QUẢN LÝ QUYẾT ĐỊNH TỐT NGHIỆP" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setVisibleForm(true)}>Thêm Mới</Button>}
    >
      <Table 
        dataSource={danhSach} 
        columns={columns} 
        rowKey={(item) => item.id || 'temp-key'} 
        loading={loading} 
        bordered
      />

      <BaseModal
        title={edit ? "Cập nhật Quyết Định" : "Thêm Quyết Định Mới"}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        onFinish={onFinish}
        initialValues={edit ? record : undefined}
      >
        <Form.Item name="soQuyetDinh" label="Số Quyết Định" rules={[{ required: true, message: 'Vui lòng nhập số quyết định!' }]}>
          <Input placeholder="VD: 42/QĐ-BGD" />
        </Form.Item>
        <Form.Item name="tenQuyetDinh" label="Tên Quyết Định" rules={[{ required: true, message: 'Vui lòng nhập tên quyết định!' }]}>
          <Input placeholder="VD: Tốt nghiệp đợt 1 năm 2025" />
        </Form.Item>
      </BaseModal>
    </Card>
  );
};

export default QuyetDinh;
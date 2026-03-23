import React, { useEffect } from 'react';
import { Card, Table, Button, Space, Popconfirm, Form, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi'; 
import BaseModal from '../components/BaseModal';

const SoVanBang = () => {
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
  } = useModel('th4.SoVanBang');

  useEffect(() => {
    getModel();
  }, []);

  const onFinish = async (values: any) => {
    if (edit && record) {
      await putModel(record.id!, values);
    } else {
      await postModel(values);
    }
  };

  const columns = [
    { title: 'Năm cấp bằng', dataIndex: 'nam', key: 'nam', width: 200 },
    { title: 'Số thứ tự hiện tại', dataIndex: 'soHienTai', key: 'soHienTai', align: 'center' as const },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      width: 150,
      render: (_: any, rec: any) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(rec)} size="small" />
          <Popconfirm title="Xóa sổ này?" onConfirm={() => deleteModel(rec.id)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="QUẢN LÝ SỔ VĂN BẰNG" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setVisibleForm(true)}>Thêm Sổ mới</Button>}
    >
      <Table 
        dataSource={danhSach} 
        columns={columns} 
        rowKey={(item) => item.id || 'temp-key'} 
        loading={loading} 
        bordered
      />

      <BaseModal
        title={edit ? "Cập nhật Sổ" : "Mở Sổ Văn Bằng mới"}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        onFinish={onFinish}
        initialValues={edit ? record : undefined}
      >
        <Form.Item name="nam" label="Năm cấp bằng" rules={[{ required: true, message: 'Không được để trống năm!' }]}>
          <InputNumber placeholder="VD: 2026" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="soHienTai" label="Số thứ tự bắt đầu" initialValue={0} rules={[{ required: true, message: 'Vui lòng nhập số!' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </BaseModal>
    </Card>
  );
};

export default SoVanBang;
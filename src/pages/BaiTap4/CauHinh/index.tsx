import React, { useEffect } from 'react';
import { Card, Table, Button, Space, Popconfirm, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import BaseModal from '../components/BaseModal';

const CauHinh = () => {
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
    setEdit,
    record,
    setRecord,
    handleEdit,
  } = useModel('th4.CauHinh');

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
    { title: 'Tên Trường Dữ Liệu', dataIndex: 'tenTruong', key: 'tenTruong', width: 250 },
    { 
      title: 'Kiểu Dữ Liệu', 
      dataIndex: 'kieuDuLieu', 
      key: 'kieuDuLieu',
      align: 'center' as const,
      render: (val: string) => <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{val}</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      width: 150,
      render: (_: any, rec: any) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(rec)} size="small" />
          <Popconfirm title="Xóa cấu hình này?" onConfirm={() => deleteModel(rec.id!)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="QUẢN LÝ CẤU HÌNH BIỂU MẪU" 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEdit(false);
            setRecord(undefined);
            setVisibleForm(true);
          }}
        >
          Thêm Cấu Hình
        </Button>
      }
    >
      <Table 
        dataSource={danhSach} 
        columns={columns} 
        rowKey={(item) => item.id || 'temp-key'} 
        loading={loading} 
        bordered
      />

      <BaseModal
        title={edit ? "Cập nhật Cấu Hình" : "Thêm Cấu Hình Mới"}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        onFinish={onFinish}
        initialValues={edit ? record : undefined}
      >
        <Form.Item name="tenTruong" label="Tên Trường" rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
          <Input placeholder="VD: Quê quán, Dân tộc..." />
        </Form.Item>
        <Form.Item name="kieuDuLieu" label="Kiểu Dữ Liệu" rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}>
          <Select placeholder="-- Chọn kiểu dữ liệu --">
            <Select.Option value="String">Văn bản (String)</Select.Option>
            <Select.Option value="Number">Số (Number)</Select.Option>
            <Select.Option value="Date">Ngày tháng (Date)</Select.Option>
            <Select.Option value="Boolean">Đúng/Sai (Boolean)</Select.Option>
          </Select>
        </Form.Item>
      </BaseModal>
    </Card>
  );
};

export default CauHinh;
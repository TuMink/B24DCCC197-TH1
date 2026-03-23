import React, { useEffect } from 'react';
import { Card, Table, Button, Space, Popconfirm, Form, InputNumber, Select } from 'antd';
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
    setEdit,
    record,
    setRecord,
    handleEdit,
  } = useModel('th4.SoVanBang');

  // Mượn data và hàm get của Quyết Định
  const {
    danhSach: danhSachQuyetDinh,
    getModel: getModelQuyetDinh,
  } = useModel('th4.QuyetDinh');

  // 1. ĐÃ GỘP USEEFFECT GỌN GÀNG
  useEffect(() => {
    getModel();
    getModelQuyetDinh();
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
    // Cột hiển thị Tên Quyết định trên bảng
    { 
      title: 'Thuộc Quyết Định', 
      dataIndex: 'idQuyetDinh', 
      key: 'idQuyetDinh',
      render: (val: string) => {
        const qd = danhSachQuyetDinh?.find((item: any) => item.id === val);
        return qd ? qd.tenQuyetDinh : <span style={{color: 'red'}}>Chưa gán</span>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      width: 150,
      render: (_: any, rec: any) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(rec)} size="small" />
          {/* 2. ĐÃ THÊM DẤU ! VÀO rec.id! CHỐNG LỖI */}
          <Popconfirm title="Xóa sổ này?" onConfirm={() => deleteModel(rec.id!)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="QUẢN LÝ SỔ VĂN BẰNG" 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEdit(false);        // Tắt chế độ Edit
            setRecord(undefined);  // Xóa sạch data cũ
            setVisibleForm(true);  // Bật form lên
          }}
        >
          Thêm Sổ mới
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
        
        {/* 3. ĐÃ BỔ SUNG DROPDOWN QUYẾT ĐỊNH Ở ĐÂY */}
        <Form.Item name="idQuyetDinh" label="Quyết định đi kèm" rules={[{ required: true, message: 'Vui lòng chọn quyết định!' }]}>
          <Select placeholder="-- Chọn một quyết định --" allowClear>
            {danhSachQuyetDinh?.map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.soQuyetDinh} - {item.tenQuyetDinh}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

      </BaseModal>
    </Card>
  );
};

export default SoVanBang;
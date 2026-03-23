import React, { useEffect } from 'react';
import { Card, Table, Button, Space, Popconfirm, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import BaseModal from '../components/BaseModal';
import moment from 'moment';

const ThongTinVanBang = () => {
  const {
    danhSach, loading, getModel, postModel, putModel, deleteModel,
    visibleForm, setVisibleForm, edit, setEdit, record, setRecord, handleEdit,
  } = useModel('th4.ThongTinVanBang');

  // Mượn Bộ não Cấu Hình (Để vẽ form/cột động) và Quyết Định (Để làm Dropdown)
  const { danhSach: danhSachCauHinh, getModel: getModelCauHinh } = useModel('th4.CauHinh');
  const { danhSach: danhSachQuyetDinh, getModel: getModelQuyetDinh } = useModel('th4.QuyetDinh');

  useEffect(() => {
    getModel();
    getModelCauHinh();
    getModelQuyetDinh();
  }, []);

  const onFinish = async (values: any) => {
    // Xử lý ép kiểu ngày tháng trước khi gửi API nếu có
    const formattedValues = { ...values };
    if (formattedValues.ngaySinh) {
      formattedValues.ngaySinh = formattedValues.ngaySinh.format('DD/MM/YYYY');
    }
    // Convert các trường Date động
    danhSachCauHinh?.forEach((ch: any) => {
      if (ch.kieuDuLieu === 'Date' && formattedValues[ch.tenTruong]) {
        formattedValues[ch.tenTruong] = formattedValues[ch.tenTruong].format('DD/MM/YYYY');
      }
    });

    if (edit && record) {
      await putModel(record.id!, formattedValues);
    } else {
      await postModel(formattedValues);
    }
  };

  // 1. TẠO CỘT CỨNG MẶC ĐỊNH
  const fixedColumns = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo', align: 'center' as const, render: (val: any) => <span style={{color: 'red', fontWeight: 'bold'}}>{val || 'Tự sinh'}</span> },
    { title: 'Số hiệu', dataIndex: 'soHieu', key: 'soHieu' },
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
    { title: 'Họ Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    { 
      title: 'Thuộc QĐ', 
      dataIndex: 'idQuyetDinh', 
      render: (val: string) => danhSachQuyetDinh?.find((q: any) => q.id === val)?.soQuyetDinh || 'N/A' 
    },
  ];

  // 2. TẠO CỘT ĐỘNG (Dựa vào cấu hình)
  const dynamicColumns = danhSachCauHinh?.map((ch: any) => ({
    title: ch.tenTruong,
    dataIndex: ch.tenTruong,
    key: ch.tenTruong,
  })) || [];

  // Ghép cột cứng, cột động và thao tác
  const columns = [
    ...fixedColumns,
    ...dynamicColumns,
    {
      title: 'Thao tác', key: 'action', align: 'center' as const, width: 100,
      render: (_: any, rec: any) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(rec)} size="small" />
          <Popconfirm title="Xóa văn bằng này?" onConfirm={() => deleteModel(rec.id!)} okText="Xóa">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="QUẢN LÝ THÔNG TIN VĂN BẰNG" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEdit(false); setRecord(undefined); setVisibleForm(true); }}>
          Thêm Văn Bằng
        </Button>
      }
    >
      <Table dataSource={danhSach} columns={columns} rowKey={(item) => item.id || 'temp'} loading={loading} bordered scroll={{ x: 'max-content' }} />

      <BaseModal
        title={edit ? "Cập nhật Văn Bằng" : "Thêm Văn Bằng Mới"}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        onFinish={onFinish}
        initialValues={edit ? { ...record, ngaySinh: record?.ngaySinh ? moment(record.ngaySinh, 'DD/MM/YYYY') : undefined } : undefined}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {/* CÁC TRƯỜNG CỨNG */}
          <Form.Item name="idQuyetDinh" label="Thuộc Quyết Định" rules={[{ required: true, message: 'Vui lòng chọn!' }]}>
            <Select placeholder="-- Chọn Quyết Định --">
              {danhSachQuyetDinh?.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.soQuyetDinh} - {item.tenQuyetDinh}</Select.Option>)}
            </Select>
          </Form.Item>
          {/* Ô này chỉ hiển thị cho biết, disabled không cho gõ */}
          <Form.Item label="Số vào sổ">
             <Input disabled placeholder={edit ? String(record?.soVaoSo) : "Hệ thống sẽ tự động tăng số"} />
          </Form.Item>

          <Form.Item name="soHieu" label="Số hiệu văn bằng" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="maSV" label="Mã Sinh Viên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="hoTen" label="Họ và Tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ngaySinh" label="Ngày sinh"><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item>

          {/* CÁC TRƯỜNG ĐỘNG LẤY TỪ CẤU HÌNH */}
          {danhSachCauHinh?.map((ch: any) => {
            let inputControl = <Input placeholder={`Nhập ${ch.tenTruong}`} />;
            if (ch.kieuDuLieu === 'Number') inputControl = <InputNumber style={{ width: '100%' }} placeholder={`Nhập số`} />;
            if (ch.kieuDuLieu === 'Date') inputControl = <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
            
            return (
              <Form.Item key={ch.id} name={ch.tenTruong} label={ch.tenTruong}>
                {inputControl}
              </Form.Item>
            );
          })}
        </div>
      </BaseModal>
    </Card>
  );
};

export default ThongTinVanBang;
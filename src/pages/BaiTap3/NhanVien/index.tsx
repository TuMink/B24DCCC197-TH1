import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Tag, Space, Popconfirm, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Option } = Select;
const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const NhanVien = () => {
  const { danhSach, loading, handleAddNhanVien, handleEditNhanVien, handleDeleteNhanVien } = useModel('baitap3.nhanVien');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleOpenAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleXoa = async (id: string) => {
    await handleDeleteNhanVien(id);
    message.success('Đã xóa nhân viên!');
  };

  const handleLuu = async (values: any) => {
    // Thuật toán kiểm tra toàn bộ danh sách ca làm việc
    if (!values.lichLamViec || values.lichLamViec.length === 0) {
      message.error('Vui lòng thêm ít nhất 1 ca làm việc!');
      return;
    }

    let isTimeError = false;
    values.lichLamViec.forEach((ca: any) => {
      if (ca.gioBatDau >= ca.gioKetThuc) isTimeError = true;
    });

    if (isTimeError) {
      message.error('Có ca làm việc nhập sai: Giờ kết thúc phải lớn hơn giờ bắt đầu!');
      return;
    }

    if (editingId) {
      await handleEditNhanVien(editingId, values);
      message.success('Cập nhật nhân viên thành công!');
    } else {
      await handleAddNhanVien(values);
      message.success('Thêm mới nhân viên thành công!');
    }
    
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60, align: 'center' as const },
    { title: 'Tên nhân viên', dataIndex: 'tenNhanVien', key: 'tenNhanVien', strong: true },
    { 
      title: 'Giới hạn (Khách/Ngày)', 
      dataIndex: 'gioiHanKhachNgay', 
      key: 'gioiHanKhachNgay', 
      align: 'center' as const,
      width: 150,
      render: (val: number) => <Tag color="volcano">{val} khách</Tag>
    },
    { 
      title: 'Chi tiết lịch làm việc', 
      dataIndex: 'lichLamViec',
      key: 'lichLamViec',
      // Map qua mảng lịch làm việc để in ra nhiều Tag
      render: (lichLamViec: any[]) => (
        <>
          {lichLamViec?.map((ca, idx) => (
            <Tag color="blue" key={idx} style={{ marginBottom: 4 }}>
              {ca.ngay}: {ca.gioBatDau}h00 - {ca.gioKetThuc}h00
            </Tag>
          ))}
        </>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      width: 150,
      render: (record: any) => (
        <Space>
          <Button type="link" onClick={() => handleOpenEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleXoa(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Quản lý Danh sách Nhân viên" 
      extra={<Button type="primary" onClick={handleOpenAdd}>+ Thêm Nhân viên</Button>}
    >
      <Table dataSource={danhSach} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal 
        title={editingId ? "Sửa thông tin" : "Thêm Nhân viên"} 
        visible={isModalVisible} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalVisible(false)}
        width={600} // Nới rộng Modal ra cho dễ nhìn
      >
        <Form form={form} layout="vertical" onFinish={handleLuu}>
          <Form.Item name="tenNhanVien" label="Tên nhân viên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="VD: Trần Tuấn Minh..." />
          </Form.Item>
          
          <Form.Item name="gioiHanKhachNgay" label="Giới hạn phục vụ (Khách/Ngày)" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
            <InputNumber style={{ width: '100%' }} min={1} max={50} />
          </Form.Item>

          <div style={{ marginBottom: 8 }}><strong>Cài đặt Ca làm việc:</strong></div>
          {/* SỬ DỤNG FORM.LIST ĐỂ THÊM NHIỀU CA */}
          <Form.List name="lichLamViec" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'ngay']}
                      rules={[{ required: true, message: 'Chọn ngày' }]}
                    >
                      <Select placeholder="Chọn Thứ" style={{ width: 120 }}>
                        {DAYS.map(day => <Option key={day} value={day}>{day}</Option>)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'gioBatDau']}
                      rules={[{ required: true, message: 'Giờ bắt đầu' }]}
                    >
                      <InputNumber min={0} max={23} placeholder="Từ (h)" />
                    </Form.Item>

                    <span style={{ padding: '0 8px' }}>đến</span>

                    <Form.Item
                      {...restField}
                      name={[name, 'gioKetThuc']}
                      rules={[{ required: true, message: 'Giờ kết thúc' }]}
                    >
                      <InputNumber min={1} max={24} placeholder="Đến (h)" />
                    </Form.Item>

                    {fields.length > 1 ? (
                      <MinusCircleOutlined style={{ color: 'red' }} onClick={() => remove(name)} />
                    ) : null}
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    + Thêm một ca làm việc khác
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
};

export default NhanVien;
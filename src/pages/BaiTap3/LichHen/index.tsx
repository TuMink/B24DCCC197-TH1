import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Tag, Space, Select, DatePicker, Dropdown, Menu, Tooltip, Popconfirm } from 'antd';
// Bổ sung các Icon xịn xò
import { SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const { Option } = Select;

const LichHen = () => {
  const { danhSach: dsLichHen, loading, handleAddLichHen, handleChangeStatus, handleEditLichHen, handleDeleteLichHen } = useModel('baitap3.lichHen');
  const { danhSach: dsNhanVien } = useModel('baitap3.nhanVien');
  const { danhSach: dsDichVu } = useModel('baitap3.dichVu');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Bấm nút thêm mới
  const handleOpenAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Bấm nút sửa (Đổ dữ liệu cũ vào form)
  const handleOpenEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      ngayHen: moment(record.ngayHen, 'YYYY-MM-DD') // Phải dùng moment dịch lại chuỗi ngày cho DatePicker hiểu
    });
    setIsModalVisible(true);
  };

  const handleXoa = async (id: string) => {
    await handleDeleteLichHen(id);
    message.success('Đã xóa lịch hẹn!');
  };

  // BỘ NÃO LOGIC (Đã nâng cấp để tương thích với chức năng Sửa)
  const handleLuu = async (values: any) => {
    const nhanVien = dsNhanVien.find(nv => nv.id === values.staffId);
    if (!nhanVien) return message.error('Không tìm thấy thông tin nhân viên!');

    const dateMoment = values.ngayHen;
    const dateStr = dateMoment.format('YYYY-MM-DD'); 
    const dayOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dateMoment.day()];
    const gioHen = values.gioHen;

    const caLam = nhanVien.lichLamViec?.find((ca: any) => ca.ngay === dayOfWeek);
    if (!caLam) {
      return message.error(`Nhân viên ${nhanVien.tenNhanVien} nghỉ làm vào ${dayOfWeek}!`);
    }

    if (gioHen < caLam.gioBatDau || gioHen >= caLam.gioKetThuc) {
      return message.error(`Nhân viên chỉ làm việc từ ${caLam.gioBatDau}h - ${caLam.gioKetThuc}h vào ${dayOfWeek}!`);
    }

    // Tường lửa 3 & 4: Đã thêm `lh.id !== editingId` để không bị tự trùng với chính mình khi Sửa
    const soKhachHienTai = dsLichHen.filter(lh => lh.staffId === nhanVien.id && lh.ngayHen === dateStr && lh.trangThai !== 'Hủy' && lh.id !== editingId).length;
    if (soKhachHienTai >= nhanVien.gioiHanKhachNgay) {
      return message.error(`Kín lịch! Nhân viên chỉ nhận tối đa ${nhanVien.gioiHanKhachNgay} khách trong ngày ${dateStr}!`);
    }

    const biTrung = dsLichHen.find(lh => lh.staffId === nhanVien.id && lh.ngayHen === dateStr && lh.gioHen === gioHen && lh.trangThai !== 'Hủy' && lh.id !== editingId);
    if (biTrung) {
      return message.error(`Trùng lịch! Khung giờ ${gioHen}h00 ngày ${dateStr} nhân viên đã có khách!`);
    }

    const dataToSave = { ...values, ngayHen: dateStr };
    
    if (editingId) {
      await handleEditLichHen(editingId, dataToSave);
      message.success('Cập nhật lịch hẹn thành công!');
    } else {
      await handleAddLichHen(dataToSave);
      message.success('Đặt lịch thành công!');
    }
    
    setIsModalVisible(false);
  };

  const statusColors: Record<string, string> = {
    'Chờ duyệt': 'warning',
    'Xác nhận': 'processing',
    'Hoàn thành': 'success',
    'Hủy': 'error'
  };

  const menuTrangThai = (record: any) => (
    <Menu onClick={({ key }) => handleChangeStatus(record.id, key)}>
      <Menu.Item key="Chờ duyệt">Chờ duyệt</Menu.Item>
      <Menu.Item key="Xác nhận">Xác nhận</Menu.Item>
      <Menu.Item key="Hoàn thành">Hoàn thành</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="Hủy" danger>Hủy lịch</Menu.Item>
    </Menu>
  );

  const columns = [
    { title: 'Khách hàng', dataIndex: 'tenKhachHang', key: 'tenKhachHang', strong: true },
    { title: 'Số điện thoại', dataIndex: 'soDienThoai', key: 'soDienThoai' },
    { 
      title: 'Dịch vụ', 
      dataIndex: 'serviceId', 
      key: 'serviceId',
      render: (id: string) => <Tag color="cyan">{dsDichVu.find(dv => dv.id === id)?.tenDichVu || 'N/A'}</Tag>
    },
    { 
      title: 'Nhân viên', 
      dataIndex: 'staffId', 
      key: 'staffId',
      render: (id: string) => dsNhanVien.find(nv => nv.id === id)?.tenNhanVien || 'N/A'
    },
    { title: 'Ngày hẹn', dataIndex: 'ngayHen', key: 'ngayHen' },
    { title: 'Giờ', dataIndex: 'gioHen', key: 'gioHen', render: (val: number) => <b>{val}h00</b> },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trangThai', 
      key: 'trangThai',
      render: (text: string) => <Tag color={statusColors[text]}>{text}</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      // CẬP NHẬT: Dùng Tooltip và Icon cho thân thiện
      render: (record: any) => (
        <Space size="middle">
          <Dropdown overlay={menuTrangThai(record)} trigger={['click']}>
            <Tooltip title="Đổi trạng thái">
              <Button type="dashed" shape="circle" icon={<SyncOutlined />} size="small" />
            </Tooltip>
          </Dropdown>
          
          <Tooltip title="Sửa thông tin">
            <Button type="primary" ghost shape="circle" icon={<EditOutlined />} size="small" onClick={() => handleOpenEdit(record)} />
          </Tooltip>

          <Popconfirm title="Bạn có chắc chắn muốn xóa lịch này?" onConfirm={() => handleXoa(record.id)}>
            <Tooltip title="Xóa lịch hẹn">
              <Button danger shape="circle" icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Quản lý lịch hẹn khách hàng" 
      extra={<Button type="primary" onClick={handleOpenAdd}>+ Đặt lịch mới</Button>}
    >
      <Table dataSource={dsLichHen} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal title={editingId ? "Sửa thông tin lịch hẹn" : "Đặt lịch hẹn dịch vụ"} visible={isModalVisible} onOk={() => form.submit()} onCancel={() => setIsModalVisible(false)} width={600}>
        <Form form={form} layout="vertical" onFinish={handleLuu}>
          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="tenKhachHang" label="Tên khách hàng" rules={[{ required: true }]}>
              <Input placeholder="Nhập tên KH" />
            </Form.Item>
            <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true }]}>
              <Input placeholder="Nhập SĐT" />
            </Form.Item>
          </Space>

          <Form.Item name="serviceId" label="Chọn Dịch vụ" rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}>
            <Select placeholder="-- Chọn dịch vụ --">
              {dsDichVu.map(dv => <Option key={dv.id} value={dv.id}>{dv.tenDichVu} - {dv.giaTien?.toLocaleString()}đ</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="staffId" label="Chọn Nhân viên phục vụ" rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}>
            <Select placeholder="-- Chọn nhân viên --">
              {dsNhanVien.map(nv => <Option key={nv.id} value={nv.id}>{nv.tenNhanVien}</Option>)}
            </Select>
          </Form.Item>

          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item name="ngayHen" label="Ngày hẹn" rules={[{ required: true }]}>
              <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="gioHen" label="Giờ hẹn (VD: 9 cho 9h00)" rules={[{ required: true }]}>
              <InputNumber min={0} max={23} addonAfter="Giờ" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default LichHen;
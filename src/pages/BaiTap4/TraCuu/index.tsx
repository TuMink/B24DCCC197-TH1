import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Table, Row, Col, Space, message, DatePicker } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const TraCuu = () => {
  const [form] = Form.useForm();
  const { ketQua, setKetQua, loading, handleTraCuu } = useModel('th4.TraCuu');
  const { danhSach: danhSachQuyetDinh, getModel: getModelQuyetDinh } = useModel('th4.QuyetDinh');

  useEffect(() => {
    getModelQuyetDinh(); // Lấy tên QĐ để hiển thị trong bảng kết quả
  }, []);

  const onFinish = (values: any) => {
    // Format lại ngày tháng trước khi gửi
    const formattedValues = { ...values };
    if (formattedValues.ngaySinh) {
      formattedValues.ngaySinh = formattedValues.ngaySinh.format('DD/MM/YYYY');
    }

    // Lọc bỏ các ô để trống và đếm xem đã nhập mấy ô
    const filledFields = Object.values(formattedValues).filter(val => val !== undefined && val !== null && val !== '');
    
    // LUẬT: Phải có ít nhất 2 tham số
    if (filledFields.length < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số để thực hiện tra cứu!');
      return;
    }

    handleTraCuu(formattedValues);
  };

  const columns = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo', align: 'center' as const, render: (val: any) => <b>{val}</b> },
    { title: 'Số hiệu', dataIndex: 'soHieu', key: 'soHieu' },
    { title: 'Mã Sinh Viên', dataIndex: 'maSV', key: 'maSV', render: (val: any) => <span style={{color: '#1890ff'}}>{val}</span> },
    { title: 'Họ và Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    { 
      title: 'Thuộc Quyết Định', 
      dataIndex: 'idQuyetDinh', 
      render: (val: string) => danhSachQuyetDinh?.find((q: any) => q.id === val)?.tenQuyetDinh || 'N/A' 
    },
  ];

  return (
    <Card title="HỆ THỐNG TRA CỨU VĂN BẰNG">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={4}><Form.Item name="soVaoSo" label="Số vào sổ"><Input placeholder="VD: 151" allowClear /></Form.Item></Col>
          <Col span={4}><Form.Item name="soHieu" label="Số hiệu văn bằng"><Input placeholder="VD: QĐ11" allowClear /></Form.Item></Col>
          <Col span={5}><Form.Item name="maSV" label="Mã sinh viên"><Input placeholder="VD: B24DCCC198" allowClear /></Form.Item></Col>
          <Col span={6}><Form.Item name="hoTen" label="Họ và tên"><Input placeholder="VD: Doan Anh" allowClear /></Form.Item></Col>
          <Col span={5}><Form.Item name="ngaySinh" label="Ngày sinh"><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" /></Form.Item></Col>
        </Row>
        <Row justify="end">
          <Space>
            <Button 
              onClick={() => { form.resetFields(); setKetQua([]); }} 
              icon={<ClearOutlined />}
            >
              Làm mới
            </Button>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
              Tra cứu
            </Button>
          </Space>
        </Row>
      </Form>

      {/* CHỈ HIỂN THỊ BẢNG KHI CÓ KẾT QUẢ */}
      {ketQua.length > 0 && (
        <Table 
          style={{ marginTop: 24 }}
          dataSource={ketQua} 
          columns={columns} 
          rowKey="id" 
          bordered
          pagination={false}
          title={() => <span style={{fontWeight: 'bold', color: 'green'}}>KẾT QUẢ TÌM KIẾM</span>}
        />
      )}
    </Card>
  );
};

export default TraCuu;
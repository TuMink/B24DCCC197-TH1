import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import { IDonDangKy } from '@/models/bt5/interfaces';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  record: IDonDangKy | null;
  mode: 'add' | 'edit' | 'view';
}

const FormDangKy: React.FC<Props> = ({ visible, onCancel, onFinish, record, mode }) => {
  const [form] = Form.useForm();
  const isView = mode === 'view';

  useEffect(() => {
    if (visible && record && mode !== 'add') form.setFieldsValue(record);
    else form.resetFields();
  }, [visible, record, mode, form]);

  const handleOk = async () => {
    if (isView) return onCancel();
    try {
      const values = await form.validateFields();
      onFinish(values);
    } catch (error) {}
  };

  return (
    <Modal title={mode === 'add' ? 'Thêm mới Đơn đăng ký' : mode === 'edit' ? 'Chỉnh sửa Đơn đăng ký' : 'Chi tiết Đơn đăng ký'} visible={visible} onOk={handleOk} onCancel={onCancel} width={700} okText={isView ? 'Đóng' : 'Lưu lại'} cancelText="Hủy" cancelButtonProps={{ style: { display: isView ? 'none' : 'inline-block' } }}>
      <Form form={form} layout="vertical" disabled={isView}>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}><Input placeholder="Nhập họ và tên" /></Form.Item></Col>
          <Col span={12}><Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }, { required: true, message: 'Vui lòng nhập email!' }]}><Input placeholder="Nhập email" /></Form.Item></Col>
          <Col span={12}><Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}><Input placeholder="Nhập số điện thoại" /></Form.Item></Col>
          <Col span={12}>
            <Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
              <Select placeholder="Chọn giới tính"><Select.Option value="Nam">Nam</Select.Option><Select.Option value="Nữ">Nữ</Select.Option><Select.Option value="Khác">Khác</Select.Option></Select>
            </Form.Item>
          </Col>
          <Col span={24}><Form.Item name="diaChi" label="Địa chỉ"><Input placeholder="Nhập địa chỉ" /></Form.Item></Col>
          <Col span={12}><Form.Item name="soTruong" label="Sở trường"><Input placeholder="Nhập sở trường của bạn" /></Form.Item></Col>
          <Col span={12}>
            <Form.Item name="cauLacBoId" label="Câu lạc bộ đăng ký" rules={[{ required: true, message: 'Vui lòng chọn CLB!' }]}>
              <Select placeholder="Chọn CLB"><Select.Option value="CLB_01">CLB Âm nhạc</Select.Option><Select.Option value="CLB_02">CLB Thể thao</Select.Option><Select.Option value="CLB_03">CLB Học thuật</Select.Option></Select>
            </Form.Item>
          </Col>
          <Col span={24}><Form.Item name="lyDoDangKy" label="Lý do đăng ký"><Input.TextArea rows={3} placeholder="Vì sao bạn muốn tham gia CLB này?" /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default FormDangKy;
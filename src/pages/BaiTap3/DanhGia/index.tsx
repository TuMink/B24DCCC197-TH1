import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Rate, message, Tag, Space } from 'antd';
import { MessageOutlined, StarOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const DanhGia = () => {
  // Lấy dữ liệu từ cả 3 bảng để match với nhau
  const { danhSach: dsDanhGia, handleAddDanhGia, handlePhanHoi } = useModel('baitap3.danhGia');
  const { danhSach: dsLichHen } = useModel('baitap3.lichHen');
  const { danhSach: dsNhanVien } = useModel('baitap3.nhanVien');

  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // CHỈ LẤY NHỮNG LỊCH HẸN ĐÃ HOÀN THÀNH ĐỂ ĐÁNH GIÁ
  const completedAppointments = dsLichHen.filter((lh: any) => lh.trangThai === 'Hoàn thành');

  const handleOpenReview = (record: any) => {
    setCurrentAppointment(record);
    form.resetFields();
    setIsReviewModalVisible(true);
  };

  const handleOpenReply = (reviewId: string) => {
    setCurrentReviewId(reviewId);
    form.resetFields();
    setIsReplyModalVisible(true);
  };

  const submitReview = async (values: any) => {
    const data = {
      ...values,
      appointmentId: currentAppointment.id,
      staffId: currentAppointment.staffId,
    };
    await handleAddDanhGia(data);
    message.success('Cảm ơn bạn đã đánh giá dịch vụ!');
    setIsReviewModalVisible(false);
  };

  const submitReply = async (values: any) => {
    if (currentReviewId) {
      await handlePhanHoi(currentReviewId, values.phanHoiNhanVien);
      message.success('Đã gửi phản hồi!');
      setIsReplyModalVisible(false);
    }
  };

  const columns = [
    { title: 'Khách hàng', dataIndex: 'tenKhachHang', key: 'tenKhachHang', strong: true },
    { 
      title: 'Nhân viên phục vụ', 
      key: 'staffId',
      render: (record: any) => dsNhanVien.find(nv => nv.id === record.staffId)?.tenNhanVien || 'N/A'
    },
    { title: 'Ngày hoàn thành', dataIndex: 'ngayHen', key: 'ngayHen' },
    {
      title: 'Đánh giá của khách',
      key: 'danhGia',
      width: 250,
      render: (record: any) => {
        // Tìm xem lịch hẹn này có bài đánh giá nào chưa
        const review = dsDanhGia.find(dg => dg.appointmentId === record.id);
        if (!review) return <Tag color="default">Chưa có đánh giá</Tag>;
        
        return (
          <Space direction="vertical" size="small">
            <Rate disabled defaultValue={review.soSao} style={{ fontSize: 14 }} />
            <span style={{ fontStyle: 'italic' }}>"{review.nhanXetKhach}"</span>
          </Space>
        );
      }
    },
    {
      title: 'Phản hồi của Nhân viên',
      key: 'phanHoi',
      width: 250,
      render: (record: any) => {
        const review = dsDanhGia.find(dg => dg.appointmentId === record.id);
        if (!review) return null;
        if (!review.phanHoiNhanVien) return <Tag color="warning">Đang chờ phản hồi...</Tag>;
        return <span style={{ color: '#1890ff' }}>{review.phanHoiNhanVien}</span>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (record: any) => {
        const review = dsDanhGia.find(dg => dg.appointmentId === record.id);
        
        if (!review) {
          return <Button type="primary" size="small" icon={<StarOutlined />} onClick={() => handleOpenReview(record)}>Viết đánh giá</Button>;
        }
        if (!review.phanHoiNhanVien) {
          return <Button type="dashed" size="small" icon={<MessageOutlined />} onClick={() => handleOpenReply(review.id)}>Phản hồi ngay</Button>;
        }
        return <Tag color="success">Đã hoàn tất</Tag>;
      }
    }
  ];

  return (
    <Card title="Đánh giá & Phản hồi">
      {/* Bảng chỉ hiển thị các lịch hẹn đã Hoàn Thành */}
      <Table dataSource={completedAppointments} columns={columns} rowKey="id" bordered />

      {/* Modal cho Khách hàng viết đánh giá */}
      <Modal title="Khách hàng đánh giá dịch vụ" visible={isReviewModalVisible} onOk={() => form.submit()} onCancel={() => setIsReviewModalVisible(false)}>
        <Form form={form} layout="vertical" onFinish={submitReview}>
          <Form.Item name="soSao" label="Chất lượng phục vụ" rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="nhanXetKhach" label="Nhận xét của khách hàng" rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}>
            <Input.TextArea rows={3} placeholder="VD: Nhân viên nhiệt tình, dịch vụ tốt..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cho Nhân viên phản hồi */}
      <Modal title="Nhân viên phản hồi đánh giá" visible={isReplyModalVisible} onOk={() => form.submit()} onCancel={() => setIsReplyModalVisible(false)}>
        <Form form={form} layout="vertical" onFinish={submitReply}>
          <Form.Item name="phanHoiNhanVien" label="Nội dung phản hồi" rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}>
            <Input.TextArea rows={3} placeholder="VD: Cảm ơn anh/chị đã ủng hộ ạ..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DanhGia;
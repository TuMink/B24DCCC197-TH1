import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Row, Col, message, Tag } from 'antd';
// Gọi tất cả các hàm từ API ra để xài
import { getCauHoi, addCauHoi, getMonHoc, getKhoiKienThuc } from '@/services/BaiTap2/Bai2/api';

const { Option } = Select;

const CauHoi = () => {
  const [data, setData] = useState<any[]>([]); // Danh sách câu hỏi hiển thị trên bảng
  const [allData, setAllData] = useState<any[]>([]); // Danh sách câu hỏi gốc (để dành khi bỏ lọc)
  const [monHocs, setMonHocs] = useState<any[]>([]); // Lưu danh sách môn học cho Menu thả xuống
  const [khoiKienThucs, setKhoiKienThucs] = useState<any[]>([]); // Lưu danh sách khối kiến thức
  
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm(); // Form riêng dành cho thanh tìm kiếm

  // Mảng độ khó cố định
  const MUC_DO = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

  // Tải TOÀN BỘ dữ liệu khi vừa vào trang
  const loadInitialData = async () => {
    setLoading(true);
    // Chạy song song 3 hàm lấy dữ liệu cho nhanh
    const [cauHoiRes, monHocRes, khoiRes] = await Promise.all([
      getCauHoi(), getMonHoc(), getKhoiKienThuc()
    ]);
    
    setData(cauHoiRes);
    setAllData(cauHoiRes);
    setMonHocs(monHocRes);
    setKhoiKienThucs(khoiRes);
    setLoading(false);
  };

  useEffect(() => { loadInitialData(); }, []);

  // Hàm xử lý Thêm mới
  const handleAdd = async (values: any) => {
    await addCauHoi(values);
    message.success('Thêm câu hỏi thành công!');
    setIsModalVisible(false);
    form.resetFields();
    loadInitialData(); // Tải lại bảng sau khi thêm
  };

  // Hàm xử lý Lọc/Tìm kiếm
  const handleSearch = (values: any) => {
    let filteredData = [...allData]; // Lấy danh sách gốc ra để lọc

    if (values.monHocId) {
      filteredData = filteredData.filter(item => item.monHocId === values.monHocId);
    }
    if (values.khoiKienThucId) {
      filteredData = filteredData.filter(item => item.khoiKienThucId === values.khoiKienThucId);
    }
    if (values.mucDo) {
      filteredData = filteredData.filter(item => item.mucDo === values.mucDo);
    }

    setData(filteredData); // Cập nhật lại bảng với dữ liệu đã lọc
  };

  // Nút xóa bộ lọc
  const handleResetSearch = () => {
    searchForm.resetFields();
    setData(allData); // Trả lại toàn bộ dữ liệu gốc
  };

  const columns = [
    { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60, align: 'center' as const },
    { title: 'Mã CH', dataIndex: 'maCH', key: 'maCH', width: 100 },
    { title: 'Nội dung câu hỏi', dataIndex: 'noiDung', key: 'noiDung' },
    { 
      title: 'Môn học', 
      dataIndex: 'monHocId', 
      key: 'monHocId',
      // Dùng ID để tìm tên môn học tương ứng trong mảng monHocs
      render: (id: string) => monHocs.find(m => m.id === id)?.tenMon || 'Chưa rõ'
    },
    { 
      title: 'Mức độ', 
      dataIndex: 'mucDo', 
      key: 'mucDo',
      render: (text: string) => {
        let color = text === 'Dễ' ? 'green' : text === 'Trung bình' ? 'blue' : text === 'Khó' ? 'orange' : 'red';
        return <Tag color={color}>{text}</Tag>;
      }
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* BỘ LỌC TÌM KIẾM */}
      <Card title="Tìm kiếm câu hỏi">
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="monHocId" label="Môn học">
            <Select placeholder="Chọn môn học" style={{ width: 150 }} allowClear>
              {monHocs.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="khoiKienThucId" label="Khối kiến thức">
            <Select placeholder="Chọn khối" style={{ width: 150 }} allowClear>
              {khoiKienThucs.map(k => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="mucDo" label="Mức độ khó">
            <Select placeholder="Chọn mức độ" style={{ width: 150 }} allowClear>
              {MUC_DO.map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Lọc</Button>
              <Button onClick={handleResetSearch}>Xóa bộ lọc</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/*BẢNG DỮ LIỆU */}
      <Card 
        title="Ngân hàng Câu hỏi tự luận" 
        extra={<Button type="primary" onClick={() => setIsModalVisible(true)}>+ Thêm Câu hỏi</Button>}
      >
        <Table dataSource={data} columns={columns} rowKey="id" loading={loading} bordered />

        {/* MODAL THÊM MỚI */}
        <Modal 
          title="Thêm Câu hỏi mới" 
          visible={isModalVisible} 
          onOk={() => form.submit()} 
          onCancel={() => setIsModalVisible(false)}
          width={700} // Cho form rộng ra chút vì nhiều trường
        >
          <Form form={form} layout="vertical" onFinish={handleAdd}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="maCH" label="Mã câu hỏi" rules={[{ required: true }]}>
                  <Input placeholder="VD: CH01" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="monHocId" label="Thuộc môn học" rules={[{ required: true }]}>
                  <Select placeholder="Chọn môn học">
                    {monHocs.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="khoiKienThucId" label="Thuộc khối kiến thức" rules={[{ required: true }]}>
                  <Select placeholder="Chọn khối">
                    {khoiKienThucs.map(k => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="mucDo" label="Mức độ khó" rules={[{ required: true }]}>
              <Select placeholder="Chọn mức độ">
                {MUC_DO.map(m => <Option key={m} value={m}>{m}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi tự luận vào đây..." />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Space>
  );
};

export default CauHoi;
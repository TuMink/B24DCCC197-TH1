import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Space, message, Tag, Typography } from 'antd';
// Đảm bảo project của bạn có cài @ant-design/icons, nếu lỗi import thì cứ xóa dòng này, lát mình dùng nút chữ
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getDeThi, addDeThi, getMonHoc, getKhoiKienThuc, getCauHoi } from '@/services/BaiTap2/Bai2/api';

const { Option } = Select;
const { Text } = Typography;

const DeThi = () => {
  const [data, setData] = useState<any[]>([]);
  const [monHocs, setMonHocs] = useState<any[]>([]);
  const [khoiKienThucs, setKhoiKienThucs] = useState<any[]>([]);
  const [nganHangCauHoi, setNganHangCauHoi] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const MUC_DO = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

  const loadInitialData = async () => {
    setLoading(true);
    const [deThiRes, monHocRes, khoiRes, cauHoiRes] = await Promise.all([
      getDeThi(), getMonHoc(), getKhoiKienThuc(), getCauHoi()
    ]);
    setData(deThiRes);
    setMonHocs(monHocRes);
    setKhoiKienThucs(khoiRes);
    setNganHangCauHoi(cauHoiRes);
    setLoading(false);
  };

  useEffect(() => { loadInitialData(); }, []);

  // THUẬT TOÁN SINH ĐỀ THI TỰ ĐỘNG
  const handleTaoDeThi = async (values: any) => {
    const { tenDeThi, monHocId, cauTruc } = values;
    let danhSachCauHoiDuocChon: any[] = [];
    let isError = false;

    // 1. Duyệt qua từng yêu cầu cấu trúc mà người dùng thêm vào
    for (let i = 0; i < cauTruc.length; i++) {
      const yeuCau = cauTruc[i];
      
      // 2. Lọc ngân hàng để tìm những câu Môn đó + Khối đó + Mức độ đó
      const cauHoiPhuHop = nganHangCauHoi.filter(ch => 
        ch.monHocId === monHocId && 
        ch.khoiKienThucId === yeuCau.khoiKienThucId && 
        ch.mucDo === yeuCau.mucDo
      );

      // 3. Kiểm tra xem ngân hàng có đủ số lượng người dùng yêu cầu không?
      if (cauHoiPhuHop.length < yeuCau.soLuong) {
        const tenKhoi = khoiKienThucs.find(k => k.id === yeuCau.khoiKienThucId)?.tenKhoi;
        message.error(`Lỗi: Không đủ câu hỏi cho [Khối: ${tenKhoi}] - [Mức: ${yeuCau.mucDo}]. Yêu cầu: ${yeuCau.soLuong}, Kho đang có: ${cauHoiPhuHop.length}`);
        isError = true;
        break; // Dừng việc tạo đề ngay lập tức
      }

      // 4. Nếu đủ thì xáo trộn ngẫu nhiên (Shuffle) và bốc ra đúng số lượng
      const shuffled = cauHoiPhuHop.sort(() => 0.5 - Math.random());
      const bocTham = shuffled.slice(0, yeuCau.soLuong);
      
      // Nhét vào túi câu hỏi được chọn
      danhSachCauHoiDuocChon = [...danhSachCauHoiDuocChon, ...bocTham];
    }

    // Nếu có lỗi thiếu câu hỏi thì không làm tiếp nữa
    if (isError) return;

    // 5. Nếu thành công, lưu đề thi lại (Lưu cả cấu trúc lẫn danh sách câu hỏi theo đúng yêu cầu đề bài)
    const deThiMoi = {
      tenDeThi,
      monHocId,
      cauTruc: cauTruc, 
      tongSoCau: danhSachCauHoiDuocChon.length,
      chiTietCauHoi: danhSachCauHoiDuocChon // Lưu lại để dùng sau
    };

    await addDeThi(deThiMoi);
    message.success(`Tuyệt vời! Tạo thành công đề thi với ${danhSachCauHoiDuocChon.length} câu hỏi.`);
    setIsModalVisible(false);
    form.resetFields();
    loadInitialData();
  };

  const columns = [
    { title: 'STT', render: (_: any, __: any, idx: number) => idx + 1, width: 60, align: 'center' as const },
    { title: 'Tên Đề Thi', dataIndex: 'tenDeThi', key: 'tenDeThi', strong: true },
    { 
      title: 'Môn học', 
      dataIndex: 'monHocId', 
      key: 'monHocId',
      render: (id: string) => <Tag color="blue">{monHocs.find(m => m.id === id)?.tenMon || 'Không rõ'}</Tag>
    },
    { title: 'Tổng số câu hỏi', dataIndex: 'tongSoCau', key: 'tongSoCau', align: 'center' as const },
    { 
      title: 'Thao tác', 
      key: 'action',
      render: () => <Button type="link">Xem chi tiết</Button> // Nút ảo để demo
    }
  ];

  return (
    <Card 
      title="Quản lý & Sinh đề thi tự động" 
      extra={<Button type="primary" onClick={() => setIsModalVisible(true)}>+ Tạo đề thi mới</Button>}
    >
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal 
        title="Thiết lập Cấu trúc & Sinh đề thi" 
        visible={isModalVisible} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalVisible(false)}
        width={800} // Form to --> set 800px cho thoải mái
        okText="Tự động sinh đề thi"
      >
        <Form form={form} layout="vertical" onFinish={handleTaoDeThi}>
          <Space size="large" style={{ width: '100%' }}>
            <Form.Item name="tenDeThi" label="Tên đề thi" rules={[{ required: true }]} style={{ width: 400 }}>
              <Input placeholder="VD: Đề thi Giữa kỳ Web - Mã 01" />
            </Form.Item>
            <Form.Item name="monHocId" label="Môn học" rules={[{ required: true }]} style={{ width: 300 }}>
              <Select placeholder="Chọn môn học">
                {monHocs.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
              </Select>
            </Form.Item>
          </Space>

          <Text strong style={{ display: 'block', marginBottom: 16 }}>Cấu trúc câu hỏi trong đề:</Text>
          
          {/*CHO PHÉP THÊM NHIỀU ĐIỀU KIỆN */}
          <Form.List name="cauTruc" initialValue={[{}]}> 
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'khoiKienThucId']}
                      rules={[{ required: true, message: 'Chọn khối' }]}
                    >
                      <Select placeholder="Chọn khối kiến thức" style={{ width: 250 }}>
                        {khoiKienThucs.map(k => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'mucDo']}
                      rules={[{ required: true, message: 'Chọn mức độ' }]}
                    >
                      <Select placeholder="Mức độ khó" style={{ width: 150 }}>
                        {MUC_DO.map(m => <Option key={m} value={m}>{m}</Option>)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'soLuong']}
                      rules={[{ required: true, message: 'Nhập SL' }]}
                    >
                      <InputNumber placeholder="Số lượng" min={1} style={{ width: 100 }} />
                    </Form.Item>

                    {fields.length > 1 ? (
                      <MinusCircleOutlined style={{ color: 'red' }} onClick={() => remove(name)} />
                    ) : null}
                  </Space>
                ))}
                
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    + Thêm một yêu cầu cấu trúc mới
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

export default DeThi;
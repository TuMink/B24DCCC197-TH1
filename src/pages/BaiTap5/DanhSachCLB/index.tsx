import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, Tag, Modal, Form, Input, DatePicker, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const DanhSachCLB = () => {
  // 1. Lấy các hàm xử lý từ Model bt5/CauLacBo.ts
  const { danhSach, loading, getModel, postModel, putModel, deleteModel } = useModel('bt5.CauLacBo') || {};

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [record, setRecord] = useState<any>(undefined);

  // 2. Tự động lấy dữ liệu khi vừa vào trang
  useEffect(() => {
    getModel?.();
  }, []);

  // 3. Hàm xử lý khi nhấn "Lưu" trên Modal (Thêm hoặc Sửa)
  const onFinish = async (values: any) => {
    try {
      // Xử lý bóc tách ảnh từ Component UploadFile của dự án
      let anhBase64 = values.anhDaiDien;
      if (typeof anhBase64 === 'object' && anhBase64?.fileList?.length > 0) {
        const file = anhBase64.fileList[0];
        // Lấy đường dẫn ảnh hoặc chuỗi base64 đã được xử lý
        anhBase64 = file.url || file.thumbUrl || file.preview || ''; 
      } else if (typeof anhBase64 === 'object' && (!anhBase64?.fileList || anhBase64?.fileList?.length === 0)) {
        anhBase64 = ''; // Trường hợp xóa ảnh
      }

      const data = {
        ...values,
        anhDaiDien: anhBase64 || '',
        ngayThanhLap: values.ngayThanhLap?.format('DD/MM/YYYY'),
      };

      if (edit) {
        await putModel?.(record.id, data);
        message.success('Cập nhật thành công');
      } else {
        await postModel?.(data);
        message.success('Thêm mới thành công');
      }

      setVisible(false);
      getModel?.(); // Tải lại bảng dữ liệu
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng kiểm tra lại!');
    }
  };

  // 4. Cấu hình các cột hiển thị trên bảng
  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'anhDaiDien',
      align: 'center' as const,
      width: 120,
      render: (val: string) => (
        <img
          src={val || 'https://via.placeholder.com/50'}
          alt="avatar"
          style={{ width: 45, height: 45, borderRadius: '50%', objectFit: 'cover', border: '1px solid #f0f0f0' }}
        />
      )
    },
    {
      title: 'Tên Câu Lạc Bộ',
      dataIndex: 'tenCLB',
      sorter: (a: any, b: any) => a.tenCLB.localeCompare(b.tenCLB),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên CLB..."
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Tìm
          </Button>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value: any, record: any) => record.tenCLB.toLowerCase().includes(value.toLowerCase()),
    },
    { title: 'Chủ nhiệm', dataIndex: 'chuNhiem' },
    { title: 'Ngày thành lập', dataIndex: 'ngayThanhLap', align: 'center' as const },
    {
      title: 'Hoạt động',
      dataIndex: 'hoatDong',
      align: 'center' as const,
      render: (val: boolean) => (
        <Tag color={val ? 'green' : 'red'}>
          {val ? 'Có' : 'Không'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      align: 'center' as const,
      width: 120,
      render: (_: any, rec: any) => (
        <Space>
          <Button 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => {
              setEdit(true);
              setRecord(rec);
              form.setFieldsValue({
                ...rec,
                ngayThanhLap: rec.ngayThanhLap ? moment(rec.ngayThanhLap, 'DD/MM/YYYY') : undefined
              });
              setVisible(true);
            }} 
          />
          <Popconfirm 
            title="Bạn có chắc chắn muốn xóa?" 
            onConfirm={() => {
              deleteModel?.(rec.id).then(() => {
                message.success('Đã xóa câu lạc bộ');
                getModel?.();
              });
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card
      title="QUẢN LÝ CÂU LẠC BỘ"
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEdit(false);
            setRecord(undefined);
            form.resetFields();
            setVisible(true);
          }}
        >
          Thêm Mới
        </Button>
      }
    >
      <Table 
        dataSource={danhSach} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
        bordered 
      />

      <Modal
        title={edit ? "Chỉnh sửa Câu lạc bộ" : "Thêm mới Câu lạc bộ"}
        visible={visible} 
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
        width={900}
        centered
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ hoatDong: true }}>
          <Form.Item name="tenCLB" label="Tên Câu lạc bộ" rules={[{ required: true, message: 'Không được để trống tên!' }]}>
            <Input placeholder="Nhập tên câu lạc bộ" />
          </Form.Item>

          <Form.Item name="chuNhiem" label="Chủ nhiệm" rules={[{ required: true, message: 'Không được để trống tên chủ nhiệm!' }]}>
            <Input placeholder="Nhập tên người quản lý" />
          </Form.Item>

          <Form.Item name="ngayThanhLap" label="Ngày thành lập">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày thành lập" />
          </Form.Item>

          <Form.Item name="hoatDong" label="Trạng thái hoạt động" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>

          <Form.Item name="anhDaiDien" label="Ảnh đại diện">
            <UploadFile isAvatar={true} />
          </Form.Item>
          
          <Form.Item name="moTa" label="Mô tả chi tiết">
            <TinyEditor height={400} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DanhSachCLB;
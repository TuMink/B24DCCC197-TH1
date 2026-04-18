import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Popconfirm, message, Tag, Image, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAdminDestinations, deleteDestination } from '@/services/BaiTap6/admin';
import DestinationForm from './components/DestinationForm';
import StatBoard from './components/StatBoard';
import styles from './style.less';

const AdminPage: React.FC = () => {
  // 1. Quản lý trạng thái
  const [data, setData] = useState<BaiTap6.Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<BaiTap6.Destination | null>(null);

  // 2. Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminDestinations();
      setData(res?.data || []); // Cấu trúc tùy thuộc API trả về, thường là res.data
    } catch (error) {
      console.error('Lỗi lấy danh sách:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chạy lần đầu tiên khi vào trang
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Hàm Xóa điểm đến
  const handleDelete = async (id: string) => {
    try {
      await deleteDestination(id);
      message.success('Đã xóa thành công!');
      fetchData(); // Load lại bảng
    } catch (error) {
      message.error('Lỗi khi xóa!');
    }
  };

  // 4. Định nghĩa các cột cho Bảng
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      render: (url: string) => <Image width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} src={url} fallback="https://via.placeholder.com/60" />,
    },
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      fontWeight: 'bold',
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      render: (type: string) => {
        const color = type === 'sea' ? 'blue' : type === 'mountain' ? 'green' : 'orange';
        const text = type === 'sea' ? 'Biển' : type === 'mountain' ? 'Núi' : 'Thành phố';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Chi phí dự kiến',
      render: (_: any, record: BaiTap6.Destination) => {
        const total = (record.priceFood || 0) + (record.priceLodging || 0) + (record.priceTransport || 0);
        return <span style={{ color: '#cf1322', fontWeight: 500 }}>{total.toLocaleString('vi-VN')} đ</span>;
      }
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      render: (rating: number) => <span>⭐ {rating}/5</span>,
    },
    {
      title: 'Thao tác',
      align: 'center' as const,
      render: (_: any, record: BaiTap6.Destination) => (
        <Space>
          <Button 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingRecord(record);
              setIsFormOpen(true);
            }} 
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa địa điểm này không?" // Gộp nội dung vào đây
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
         <Button danger icon={<DeleteOutlined />} />
         </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    
    <div style={{ padding: 24 }}>
      {/* THÊM BẢNG THỐNG KÊ VÀO ĐÂY */}
      <StatBoard />
      <Card title="Quản trị Điểm đến du lịch" bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingRecord(null); // Form trống để thêm mới
              setIsFormOpen(true);
            }}
          >
            Thêm mới điểm đến
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Gọi Form Thêm/Sửa ở đây */}
      <DestinationForm 
        visible={isFormOpen} 
        setVisible={setIsFormOpen} 
        record={editingRecord} 
        reload={fetchData} // Lưu xong thì gọi fetchData để tải lại bảng
      />
    </div>
  );
};

export default AdminPage;
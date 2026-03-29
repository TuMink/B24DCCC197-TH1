import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Select } from 'antd';
import { useModel } from 'umi';
import { IDonDangKy } from '@/models/bt5/interfaces';
import ModalDoiCLB from './components/ModalDoiCLB';

// Từ điển Map ID sang Tên CLB
const CLB_MAP: Record<string, string> = {
  'CLB_01': 'CLB Âm nhạc',
  'CLB_02': 'CLB Thể thao',
  'CLB_03': 'CLB Học thuật',
};

const DanhSachThanhVien = () => {
  const {
    danhSachThanhVien, loading,
    selectedRowKeys, setSelectedRowKeys,
    visibleModalDoiCLB, setVisibleModalDoiCLB,
    currentMemberIds, setCurrentMemberIds,
    handleDoiCLB
  } = useModel('bt5.ThanhVien');

  // State để lọc thành viên theo CLB trên giao diện
  const [filterClubId, setFilterClubId] = useState<string | undefined>(undefined);

  // Lọc dữ liệu hiển thị trên Table
  const displayData = filterClubId 
    ? danhSachThanhVien.filter(item => item.cauLacBoId === filterClubId)
    : danhSachThanhVien;

  const columns = [
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
    {
      title: 'Câu lạc bộ đang sinh hoạt',
      dataIndex: 'cauLacBoId',
      key: 'cauLacBoId',
      render: (id: string) => <Tag color="blue">{CLB_MAP[id] || id}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IDonDangKy) => (
        <a onClick={() => {
          setCurrentMemberIds([record.id]);
          setVisibleModalDoiCLB(true);
        }}>
          Đổi CLB
        </a>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => setSelectedRowKeys(newSelectedRowKeys),
  };

  return (
    <Card title="Quản lý Thành viên Câu lạc bộ">
      {/* KHU VỰC THANH CÔNG CỤ (Lọc & Thao tác) */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <span style={{ fontWeight: 500 }}>Xem theo CLB:</span>
          <Select 
            style={{ width: 250 }} 
            placeholder="Tất cả câu lạc bộ" 
            allowClear
            onChange={(val) => setFilterClubId(val)}
          >
            <Select.Option value="CLB_01">CLB Âm nhạc</Select.Option>
            <Select.Option value="CLB_02">CLB Thể thao</Select.Option>
            <Select.Option value="CLB_03">CLB Học thuật</Select.Option>
          </Select>
        </Space>

        <Button 
          type="primary" 
          disabled={selectedRowKeys.length === 0} 
          onClick={() => {
            setCurrentMemberIds(selectedRowKeys as string[]);
            setVisibleModalDoiCLB(true);
          }}
        >
          Đổi CLB cho {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''} thành viên đã chọn
        </Button>
      </div>

      <Table 
        rowKey="id" 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={displayData} 
        loading={loading} 
      />

      <ModalDoiCLB 
        visible={visibleModalDoiCLB}
        count={currentMemberIds.length}
        onCancel={() => setVisibleModalDoiCLB(false)}
        onSubmit={(newCauLacBoId) => handleDoiCLB(currentMemberIds, newCauLacBoId)}
      />
    </Card>
  );
};

export default DanhSachThanhVien;
import React, { useRef, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, Card } from 'antd';
import { useModel } from 'umi';
import ModalTuChoi from './components/ModalTuChoi';
import DrawerLichSu from './components/DrawerLichSu';
import FormDangKy from './components/FormDangKy';
import { IDonDangKy } from '@/models/bt5/interfaces';

const DanhSachDonDangKy = () => {
  const {
    danhSachDon, loading, 
    selectedRowKeys, setSelectedRowKeys,
    visibleForm, setVisibleForm,
    visibleTuChoi, setVisibleTuChoi,
    visibleLichSu, setVisibleLichSu,
    currentRecord, setCurrentRecord,
    handleThemMoi, handleCapNhat, handleXoa, handleThayDoiTrangThai
  } = useModel('bt5.DonDangKy');

  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add');
  const isBulkReject = useRef<boolean>(false); 

  const columns = [
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
    { 
      title: 'CLB đăng ký', 
      dataIndex: 'cauLacBoId', 
      key: 'cauLacBoId',
      render: (id: string) => {
        const CLB_MAP: Record<string, string> = {
          'CLB_01': 'CLB Âm nhạc',
          'CLB_02': 'CLB Thể thao',
          'CLB_03': 'CLB Học thuật',
        };
        return <Tag color="blue">{CLB_MAP[id] || id}</Tag>; 
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => <Tag color={status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning'}>{status}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IDonDangKy) => (
        <Space size="middle">
          <a onClick={() => { setCurrentRecord(record); setFormMode('view'); setVisibleForm(true); }}>Xem</a>
          {record.trangThai === 'Pending' && <a onClick={() => { setCurrentRecord(record); setFormMode('edit'); setVisibleForm(true); }}>Sửa</a>}
          <a onClick={() => { setCurrentRecord(record); setVisibleLichSu(true); }}>Lịch sử</a>
          {record.trangThai === 'Pending' && (
            <>
              <a style={{color: 'green'}} onClick={() => handleThayDoiTrangThai([record.id], 'Approved')}>Duyệt</a>
              <a style={{color: 'red'}} onClick={() => { setCurrentRecord(record); isBulkReject.current = false; setVisibleTuChoi(true); }}>Từ chối</a>
            </>
          )}
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleXoa(record.id)}>
            <a style={{color: 'gray'}}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = { 
    selectedRowKeys, 
    onChange: (newSelectedRowKeys: React.Key[]) => setSelectedRowKeys(newSelectedRowKeys),
    getCheckboxProps: (record: IDonDangKy) => ({
      disabled: record.trangThai !== 'Pending',
      name: record.hoTen,
    }),
  };

  return (
    <Card title="Quản lý đơn đăng ký thành viên">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" onClick={() => { setFormMode('add'); setVisibleForm(true); }}>+ Thêm mới đơn</Button>
          <Button type="default" disabled={selectedRowKeys.length === 0} onClick={() => handleThayDoiTrangThai(selectedRowKeys as string[], 'Approved')}>
            Duyệt {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''} đơn
          </Button>
          <Button danger disabled={selectedRowKeys.length === 0} onClick={() => { isBulkReject.current = true; setVisibleTuChoi(true); }}>
            Từ chối {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''} đơn
          </Button>
        </Space>
      </div>

      <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={danhSachDon} loading={loading} />

      <ModalTuChoi 
        visible={visibleTuChoi} 
        onCancel={() => setVisibleTuChoi(false)}
        onSubmit={(lyDo) => {
          const ids = isBulkReject.current ? (selectedRowKeys as string[]) : [currentRecord?.id as string];
          handleThayDoiTrangThai(ids, 'Rejected', lyDo);
        }}
      />
      <DrawerLichSu visible={visibleLichSu} onClose={() => setVisibleLichSu(false)} record={currentRecord} />
      <FormDangKy 
        visible={visibleForm} mode={formMode} record={currentRecord} onCancel={() => setVisibleForm(false)}
        onFinish={(values) => formMode === 'add' ? handleThemMoi(values) : handleCapNhat(currentRecord?.id as string, values)}
      />
    </Card>
  );
};
export default DanhSachDonDangKy;
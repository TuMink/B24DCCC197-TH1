import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  DollarOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';
import { useModel } from 'umi';

const { Title } = Typography;

const Dashboard = () => {
  // "Hút" dữ liệu từ 3 model đã tạo
  const { danhSach: dsLichHen, loading: loadingLich } = useModel('baitap3.lichHen');
  const { danhSach: dsDichVu } = useModel('baitap3.dichVu');
  const { danhSach: dsNhanVien } = useModel('baitap3.nhanVien');

  // --- THUẬT TOÁN THỐNG KÊ TỔNG QUAN ---
  const tongSoLich = dsLichHen.length;
  const lichHoanThanh = dsLichHen.filter(lh => lh.trangThai === 'Hoàn thành').length;
  const lichHuy = dsLichHen.filter(lh => lh.trangThai === 'Hủy').length;

  // Tính tổng doanh thu (Chỉ tính những lịch đã Hoàn thành)
  const tongDoanhThu = useMemo(() => {
    return dsLichHen
      .filter(lh => lh.trangThai === 'Hoàn thành')
      .reduce((total, lh) => {
        const dichVu = dsDichVu.find(dv => dv.id === lh.serviceId);
        return total + (dichVu?.giaTien || 0);
      }, 0);
  }, [dsLichHen, dsDichVu]);

  // --- THUẬT TOÁN THỐNG KÊ DOANH THU THEO NHÂN VIÊN ---
  const thongKeNhanVien = useMemo(() => {
    const map = new Map();
    
    dsLichHen.forEach(lh => {
      if (lh.trangThai === 'Hoàn thành') {
        const dichVu = dsDichVu.find(dv => dv.id === lh.serviceId);
        const tien = dichVu?.giaTien || 0;
        
        if (map.has(lh.staffId)) {
          const current = map.get(lh.staffId);
          map.set(lh.staffId, { 
            soKhach: current.soKhach + 1, 
            doanhThu: current.doanhThu + tien 
          });
        } else {
          map.set(lh.staffId, { soKhach: 1, doanhThu: tien });
        }
      }
    });

    // Chuyển Map thành Mảng để đưa vào Table
    return Array.from(map, ([staffId, data]) => ({
      id: staffId,
      tenNhanVien: dsNhanVien.find(nv => nv.id === staffId)?.tenNhanVien || 'N/A',
      soKhach: data.soKhach,
      doanhThu: data.doanhThu
    })).sort((a, b) => b.doanhThu - a.doanhThu); // Sắp xếp ai kiếm nhiều tiền nhất lên đầu
  }, [dsLichHen, dsDichVu, dsNhanVien]);

  // --- THUẬT TOÁN THỐNG KÊ DOANH THU THEO DỊCH VỤ ---
  const thongKeDichVu = useMemo(() => {
    const map = new Map();
    
    dsLichHen.forEach(lh => {
      if (lh.trangThai === 'Hoàn thành') {
        const dichVu = dsDichVu.find(dv => dv.id === lh.serviceId);
        const tien = dichVu?.giaTien || 0;
        
        if (map.has(lh.serviceId)) {
          const current = map.get(lh.serviceId);
          map.set(lh.serviceId, { 
            soLuotDat: current.soLuotDat + 1, 
            doanhThu: current.doanhThu + tien 
          });
        } else {
          map.set(lh.serviceId, { soLuotDat: 1, doanhThu: tien });
        }
      }
    });

    return Array.from(map, ([serviceId, data]) => ({
      id: serviceId,
      tenDichVu: dsDichVu.find(dv => dv.id === serviceId)?.tenDichVu || 'N/A',
      soLuotDat: data.soLuotDat,
      doanhThu: data.doanhThu
    })).sort((a, b) => b.doanhThu - a.doanhThu);
  }, [dsLichHen, dsDichVu]);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: 24 }}>Bảng Thống kê & Báo cáo</Title>

      {/* HÀNG 1: THẺ THỐNG KÊ TỔNG QUAN */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Tổng lịch hẹn" value={tongSoLich} prefix={<CalendarOutlined style={{ color: '#1890ff' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Đã hoàn thành" value={lichHoanThanh} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Đã hủy" value={lichHuy} prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Tổng doanh thu" value={tongDoanhThu} prefix={<DollarOutlined style={{ color: '#faad14' }} />} suffix="VNĐ" />
          </Card>
        </Col>
      </Row>

      {/* HÀNG 2: BẢNG XẾP HẠNG DOANH THU */}
      <Row gutter={[16, 16]}>
        {/* Bảng Nhân viên xuất sắc */}
        <Col xs={24} lg={12}>
          <Card title="Top Nhân viên mang lại doanh thu" bordered={false} style={{ borderRadius: 8 }}>
            <Table 
              dataSource={thongKeNhanVien} 
              rowKey="id" 
              pagination={false} 
              loading={loadingLich}
              columns={[
                { title: 'Nhân viên', dataIndex: 'tenNhanVien', key: 'tenNhanVien', render: (text: string) => <b>{text}</b> },
                { title: 'Số khách đã phục vụ', dataIndex: 'soKhach', key: 'soKhach', align: 'center', render: (val: number) => <Tag color="blue">{val}</Tag> },
                { title: 'Doanh thu (VNĐ)', dataIndex: 'doanhThu', key: 'doanhThu', align: 'right', render: (val: number) => <b style={{ color: '#faad14' }}>{val.toLocaleString()}</b> },
              ]} 
            />
          </Card>
        </Col>

        {/* Bảng Dịch vụ HOT */}
        <Col xs={24} lg={12}>
          <Card title="Top Dịch vụ được đặt nhiều nhất" bordered={false} style={{ borderRadius: 8 }}>
            <Table 
              dataSource={thongKeDichVu} 
              rowKey="id" 
              pagination={false} 
              loading={loadingLich}
              columns={[
                { title: 'Dịch vụ', dataIndex: 'tenDichVu', key: 'tenDichVu', render: (text: string) => <b>{text}</b> },
                { title: 'Số lượt đặt', dataIndex: 'soLuotDat', key: 'soLuotDat', align: 'center', render: (val: number) => <Tag color="cyan">{val}</Tag> },
                { title: 'Doanh thu (VNĐ)', dataIndex: 'doanhThu', key: 'doanhThu', align: 'right', render: (val: number) => <b style={{ color: '#faad14' }}>{val.toLocaleString()}</b> },
              ]} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
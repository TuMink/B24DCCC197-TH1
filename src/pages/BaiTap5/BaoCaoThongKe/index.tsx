import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, message } from 'antd';
import { DownloadOutlined, TeamOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Chart from 'react-apexcharts'; // Dùng thư viện có sẵn trong package.json
import { exportToExcel } from '@/utils/exportExcel';

const BaoCaoThongKe = () => {
  // 1. Kéo data từ bộ não Model chung
  const { danhSach, loading, getModel } = useModel('bt5.CauLacBo') || {};

  useEffect(() => {
    getModel?.();
  }, []);

  // 2. Tính toán các con số thống kê
  const total = danhSach?.length || 0;
  const activeCount = danhSach?.filter((item: any) => item.hoatDong).length || 0;
  const inactiveCount = total - activeCount;

  // 3. Cấu hình cho Biểu đồ Tròn (ApexCharts)
  const chartOptions: any = {
    labels: ['Đang hoạt động', 'Ngừng hoạt động'],
    colors: ['#52c41a', '#ff4d4f'],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Tổng CLB',
            }
          }
        }
      }
    }
  };
  const chartSeries = [activeCount, inactiveCount];

  // 4. Hàm xử lý khi bấm nút Xuất Excel
  const handleExport = () => {
    if (!danhSach || danhSach.length === 0) {
      message.warning('Không có dữ liệu để xuất!');
      return;
    }
    try {
      exportToExcel(danhSach, `Bao_Cao_CLB_${new Date().getTime()}`);
      message.success('Xuất file Excel thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất file!');
    }
  };

  return (
    <Card 
      title="BÁO CÁO THỐNG KÊ CÂU LẠC BỘ" 
      extra={
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} loading={loading}>
          Xuất Báo Cáo (Excel)
        </Button>
      }
    >
      {/* KHỐI 1: CÁC THẺ SỐ LIỆU */}
      <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: '#f0f2f5', borderRadius: 8 }}>
            <Statistic title="Tổng số Câu lạc bộ" value={total} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: '#f6ffed', borderRadius: 8 }}>
            <Statistic title="Đang hoạt động" value={activeCount} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: '#fff1f0', borderRadius: 8 }}>
            <Statistic title="Ngừng hoạt động" value={inactiveCount} valueStyle={{ color: '#cf1322' }} prefix={<StopOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* KHỐI 2: BIỂU ĐỒ */}
      <Row justify="center">
        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
          <h3>Biểu đồ cơ cấu trạng thái hoạt động</h3>
          {total > 0 ? (
            <Chart options={chartOptions} series={chartSeries} type="donut" height={350} />
          ) : (
            <p style={{ color: '#999', marginTop: 50 }}>Chưa có dữ liệu để hiển thị biểu đồ</p>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default BaoCaoThongKe;
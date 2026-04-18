import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Table, Tag, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { currentUser } = useModel('BaiTap7.useAuth');
  const { tasks } = useModel('BaiTap7.useTask');

  useEffect(() => {
    if (!localStorage.getItem('th7_user')) {
      history.push('/bai-tap-7/dang-nhap');
    }
  }, []);

  if (!currentUser) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const myTasks = tasks.filter(t => t.assignee === currentUser.username);
  const myCompleted = myTasks.filter(t => t.status === 'done').length;
  const myRate = myTasks.length > 0 ? Math.round((myCompleted / myTasks.length) * 100) : 0;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Thống kê Tổng quan</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic title="Tổng công việc" value={totalTasks} prefix={<ProjectOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic title="Đã hoàn thành" value={completedTasks} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic title="Đang thực hiện" value={inProgressTasks} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic title="Việc của tôi" value={myTasks.length} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Tiến độ dự án (Cả nhóm)" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Progress type="circle" percent={completionRate} width={180} strokeColor="#52c41a" />
              <div style={{ marginTop: 20 }}>
                <Text type="secondary">Tỷ lệ hoàn thành công việc toàn đội</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tiến độ cá nhân" style={{ height: '100%' }}>
            <div style={{ marginBottom: 30 }}>
              <Text strong>Tên người dùng: {currentUser.username}</Text>
              <Progress percent={myRate} status="active" strokeColor="#1890ff" style={{ marginTop: 10 }} />
              <Text type="secondary">Bạn đã hoàn thành {myCompleted}/{myTasks.length} nhiệm vụ</Text>
            </div>
            
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
              <Title level={5}>Phân bổ trạng thái</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Chưa làm</span>
                  <Tag color="orange">{todoTasks}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Đang làm</span>
                  <Tag color="blue">{inProgressTasks}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Đã xong</span>
                  <Tag color="green">{completedTasks}</Tag>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
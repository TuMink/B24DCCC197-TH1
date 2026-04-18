import React from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Title } = Typography;

const LoginPage = () => {
  const { login } = useModel('BaiTap7.useAuth');

  const onFinish = (values: { username: string }) => {
    login(values.username.trim());
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
      <Card title={<Title level={4} style={{ textAlign: 'center', margin: 0 }}>ĐĂNG NHẬP HỆ THỐNG</Title>} style={{ width: 350, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item 
            name="username" 
            label="Tên người dùng"
            rules={[{ required: true, message: 'Hãy nhập tên để làm việc!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ví dụ: Đoàn Tuấn Minh" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Vào ứng dụng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
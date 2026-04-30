import React from 'react';
import { Card, Avatar, Typography, Space, Tag } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const profile = {
  name: 'Ngô Minh Hiếu (Hiếu PC)',
  avatar: '/avatar/john.png',
  bio: 'là chuyên gia tại Trung tâm Giám sát an toàn không gian mạng quốc gia (NCSC)',
  skills: ['React', 'UmiJS', 'Ant Design', 'JavaScript', 'TypeScript'],
  socials: [
    { icon: <GithubOutlined />, url: 'https://github.com/johndoe' },
    { icon: <LinkedinOutlined />, url: 'https://linkedin.com/in/johndoe' },
    { icon: <MailOutlined />, url: 'mailto:johndoe@email.com' },
  ],
};

const About: React.FC = () => (
  <div style={{ maxWidth: 500, margin: '0 auto', padding: 32 }}>
    <Card bordered={false} style={{ textAlign: 'center' }}>
      <Avatar src={profile.avatar} size={96} />
      <Title level={3} style={{ marginTop: 16 }}>{profile.name}</Title>
      <Paragraph>{profile.bio}</Paragraph>
      <Space wrap style={{ marginBottom: 16 }}>
        {profile.skills.map(skill => <Tag key={skill} color="blue">{skill}</Tag>)}
      </Space>
      <Space size="large">
        {profile.socials.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 22 }}>
            {s.icon}
          </a>
        ))}
      </Space>
    </Card>
  </div>
);

export default About;

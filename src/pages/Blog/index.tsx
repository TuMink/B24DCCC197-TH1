import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Input, Space, Typography, Spin } from 'antd';
import { history } from 'umi';
import { EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import * as blogService from '../../services/blog';

const { Title, Paragraph, Text } = Typography;

const BlogList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    blogService.getPosts().then(res => {
      setData(res.filter((p: any) => p.status === 'published'));
      setLoading(false);
    });
  }, []);

  const filtered = data.filter((p: any) => 
    p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) && 
    (!selectedTag || p.tags?.includes(selectedTag))
  );

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2}>Khám phá Blog Công Nghệ</Title>
        <Input.Search 
          placeholder="Tìm bài viết (Debounce 300ms)..." 
          size="large" 
          onChange={e => setSearch(e.target.value)} 
          style={{ maxWidth: 500, marginBottom: 20 }} 
        />
        <div style={{ marginTop: 10 }}>
          <Text strong>Lọc theo thẻ: </Text>
          <Tag color={!selectedTag ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => setSelectedTag(null)}>Tất cả</Tag>
          {Array.from(new Set(data.flatMap((p: any) => p.tags || []))).map(t => (
            <Tag key={t} color={selectedTag === t ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => setSelectedTag(t)}>{t}</Tag>
          ))}
        </div>
      </div>

      <List
        grid={{ gutter: 24, md: 3, sm: 2, xs: 1 }}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 9, align: 'center' }}
        renderItem={(item: any) => (
          <List.Item>
            <Card 
              hoverable 
              style={{ borderRadius: 12, overflow: 'hidden' }}
              cover={<img src={item.coverUrl} style={{ height: 200, objectFit: 'cover' }} />}
              onClick={() => history.push(`/blog/${item.slug}`)}
            >
              <Title level={4} ellipsis={{ rows: 2 }} style={{ height: 50 }}>{item.title}</Title>
              <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ height: 45 }}>{item.summary || item.content.substring(0, 100)}</Paragraph>
              <div style={{ marginBottom: 12, height: 25 }}>
                {item.tags?.map((t: any) => <Tag key={t} color="orange">{t}</Tag>)}
              </div>
              <Space split="|" style={{ fontSize: 12, color: '#999' }}>
                <span><CalendarOutlined /> {item.createdAt}</span>
                <span><EyeOutlined /> {item.views} lượt xem</span>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default BlogList;
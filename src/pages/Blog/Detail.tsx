import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Card, Tag, Avatar, Button, Space, Divider, Typography, Row, Col, Spin, Empty } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import * as blogService from '../../services/blog';
import type { BlogPost } from '../../models/blog';

const { Title, Text } = Typography;

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (slug) {
        const data = await blogService.getPostBySlug(slug);
        if (data) {
          setPost(data);
          // Tự động tăng view khi vào bài
          await blogService.increaseView(data.id);
          // Lấy bài viết liên quan dựa trên tag của bài hiện tại
          const relatedData = await blogService.getRelatedPosts(data.id, data.tags || []);
          setRelated(relatedData);
        }
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadData();
  }, [slug]);

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (!post) return <Empty description="Không tìm thấy bài viết" style={{ padding: 100 }} />;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => history.push('/blog')} 
        style={{ marginBottom: 24, borderRadius: 6 }}
      >
        Quay lại
      </Button>

      <Card 
        bordered={false} 
        style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: 12, overflow: 'hidden' }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ width: '100%', height: 400, backgroundColor: '#f0f2f5', overflow: 'hidden' }}>
          <img 
            src={post.coverUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1000x400?text=No+Cover+Image';
            }}
          />
        </div>
        
        <div style={{ padding: '40px' }}>
          <Title level={1} style={{ marginBottom: 24, fontSize: 36 }}>{post.title}</Title>
          
          <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
            <Col>
              <Space size="large">
                <Space>
                  <Avatar 
                    size="large" 
                    src={post.author?.avatar} 
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <Text strong style={{ fontSize: 16 }}>{post.author?.name || 'Admin'}</Text>
                </Space>
                <Text type="secondary"><CalendarOutlined /> {post.createdAt}</Text>
                <Text type="secondary"><EyeOutlined /> {post.views || 0} lượt xem</Text>
              </Space>
            </Col>
            <Col>
              <div>
                {post.tags?.map(t => <Tag key={t} color="blue" style={{ borderRadius: 4, padding: '2px 10px' }}>{t}</Tag>)}
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: '0 0 40px 0' }} />
          
          <div className="blog-content" style={{ fontSize: 18, lineHeight: 1.8, color: '#333' }}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </Card>

      {/* PHẦN BÀI VIẾT LIÊN QUAN - HIỂN THỊ DƯỚI BÀI ĐANG XEM */}
      {related.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <Divider orientation="left">
            <Title level={3} style={{ margin: 0 }}>Bài viết liên quan</Title>
          </Divider>
          <Row gutter={24} style={{ marginTop: 24 }}>
            {related.map(item => (
              <Col xs={24} sm={8} key={item.id}>
                <Card
                  hoverable
                  bodyStyle={{ padding: 12 }}
                  cover={
                    <img 
                      src={item.coverUrl || 'https://via.placeholder.com/300x150'} 
                      style={{ height: 140, objectFit: 'cover' }} 
                    />
                  }
                  onClick={() => history.push(`/blog/${item.slug}`)}
                  style={{ borderRadius: 8, overflow: 'hidden', height: '100%' }}
                >
                  <Card.Meta 
                    title={
                      <div style={{ 
                        fontSize: 15, 
                        whiteSpace: 'normal', 
                        height: 45, 
                        overflow: 'hidden',
                        lineHeight: '1.5'
                      }}>
                        {item.title}
                      </div>
                    } 
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
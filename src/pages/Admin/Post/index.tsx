import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import * as blogService from '../../../services/blog';
import PostForm from './components/PostForm';

const AdminPosts = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(undefined);

  const fetchData = () => blogService.getPosts().then(setData);
  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status',
      filters: [{ text: 'Đã đăng', value: 'published' }, { text: 'Nháp', value: 'draft' }],
      onFilter: (v: any, r: any) => r.status === v,
      render: (s: any) => <Tag color={s === 'published' ? 'green' : 'gray'}>{s === 'published' ? 'Đã đăng' : 'Nháp'}</Tag>
    },
    { 
      title: 'Thẻ', 
      dataIndex: 'tags', 
      render: (t: any) => t?.map((tag: any) => <Tag key={tag} color="blue">{tag}</Tag>) 
    },
    { title: 'Lượt xem', dataIndex: 'views', sorter: (a: any, b: any) => a.views - b.views },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
    {
      title: 'Hành động',
      render: (_: any, r: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => { setEditing(r); setVisible(true); }} />
          <Popconfirm title="Xóa bài viết này?" onConfirm={() => blogService.deletePost(r.id).then(fetchData)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(undefined); setVisible(true); }}>Thêm bài</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 9 }} />
      <PostForm 
        visible={visible} 
        onCancel={() => setVisible(false)} 
        onOk={async (v: any) => {
          editing ? await blogService.updatePost(editing.id, v) : await blogService.addPost(v);
          setVisible(false); fetchData();
          message.success('Thành công!');
        }} 
        initialValues={editing} 
      />
    </div>
  );
};
export default AdminPosts;
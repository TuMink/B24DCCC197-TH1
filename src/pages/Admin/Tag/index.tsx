import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import * as blogService from '../../../services/blog';
import type { Tag } from '../../../models/blog';
import TagForm from './components/TagForm';

const AdminTags: React.FC = () => {
  const [data, setData] = useState<Tag[]>([]);
  const [editing, setEditing] = useState<Tag | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    const res = await blogService.getTags();
    setData(res || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (values: Partial<Tag>) => {
    try {
      if (editing) {
        await blogService.updateTag(editing.name, values);
        message.success('Cập nhật thẻ thành công');
      } else {
        await blogService.addTag(values);
        message.success('Thêm thẻ mới thành công');
      }
      setIsModalVisible(false);
      fetchData();
    } catch (e) {
      message.error('Thao tác thất bại');
    }
  };

  const columns = [
    { 
      title: 'Tên thẻ', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
    },
    { 
      title: 'Số bài viết sử dụng', 
      dataIndex: 'postCount', 
      key: 'postCount',
      render: (count: number) => count || 0
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Tag) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditing(record);
              setIsModalVisible(true);
            }} 
          />
          <Popconfirm 
            title="Xóa thẻ này không làm mất bài viết. Bạn chắc chắn chứ?" 
            onConfirm={() => blogService.deleteTag(record.name).then(fetchData)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditing(undefined);
            setIsModalVisible(true);
          }}
        >
          Thêm thẻ mới
        </Button>
      </div>

      <Table 
        rowKey="name" 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 10 }}
      />

      <TagForm 
        visible={isModalVisible} 
        onOk={handleSave} 
        onCancel={() => setIsModalVisible(false)} 
        initialValues={editing} 
      />
    </div>
  );
};

export default AdminTags;
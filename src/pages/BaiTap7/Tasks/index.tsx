import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Select, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import dayjs from 'dayjs';

const { Text } = Typography;

const TasksPage = () => {
  const { currentUser, logout } = useModel('BaiTap7.useAuth');
  const { tasks, deleteTask, updateTask } = useModel('BaiTap7.useTask');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<BaiTap7.Task | null>(null);

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');

  useEffect(() => {
    if (!localStorage.getItem('th7_user')) {
      history.push('/bai-tap-7/dang-nhap');
    }
  }, []);

  if (!currentUser) return null;

  const displayedTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchAssignee = filterAssignee === 'all' || (filterAssignee === 'me' && t.assignee === currentUser.username);
    return matchSearch && matchStatus && matchAssignee;
  });

  const columns = [
    { title: 'Công việc', dataIndex: 'title', render: (t: string) => <strong>{t}</strong> },
    { title: 'Người giao', dataIndex: 'assignee', render: (a: string) => <Tag color="blue">{a}</Tag> },
    { title: 'Deadline', dataIndex: 'deadline', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    { 
      title: 'Độ ưu tiên', 
      dataIndex: 'priority', 
      render: (prio: string) => {
        const colors = { low: 'green', medium: 'orange', high: 'red' };
        const labels = { low: 'Thấp', medium: 'TB', high: 'Cao' };
        return <Tag color={colors[prio as keyof typeof colors]}>{labels[prio as keyof typeof labels]}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: BaiTap7.Task) => (
        <Select
          value={status}
          onChange={(val) => updateTask(record.id, { status: val as BaiTap7.Status })}
          options={[
            { value: 'todo', label: 'Chưa làm' },
            { value: 'in-progress', label: 'Đang làm' },
            { value: 'done', label: 'Đã xong' },
          ]}
          style={{ width: 110 }}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: BaiTap7.Task) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => { setEditingTask(record); setIsModalOpen(true); }} />
          <Popconfirm title="Xóa việc này?" onConfirm={() => deleteTask(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16, background: '#fafafa' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <UserOutlined style={{ color: '#1890ff' }} />
            <Text>Xin chào, <Text strong>{currentUser.username}</Text></Text>
          </Space>
          <Button danger type="text" icon={<LogoutOutlined />} onClick={logout}>Đăng xuất</Button>
        </div>
      </Card>

      <Card title="Danh sách Công việc">
        {/* SỬ DỤNG COMPONENT FILTERBAR ĐÃ TÁCH */}
        <FilterBar 
          onSearch={setSearchText}
          onStatusChange={setFilterStatus}
          onAssigneeChange={setFilterAssignee}
          onAddTask={() => { setEditingTask(null); setIsModalOpen(true); }}
          filterStatus={filterStatus}
          filterAssignee={filterAssignee}
        />

        <Table columns={columns} dataSource={displayedTasks} rowKey="id" pagination={{ pageSize: 5 }} />
      </Card>

      <TaskForm open={isModalOpen} onCancel={() => setIsModalOpen(false)} editingTask={editingTask} />
    </div>
  );
};

export default TasksPage;
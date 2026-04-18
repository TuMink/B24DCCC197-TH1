import React, { useState, useEffect } from 'react';
import { Card, Calendar, Badge, BadgeProps, Switch, Space, Typography, Tag } from 'antd';
import { useModel, history } from 'umi';
import dayjs, { Dayjs } from 'dayjs';

const { Text, Title } = Typography;

const CalendarPage = () => {
  const { currentUser } = useModel('BaiTap7.useAuth');
  const { tasks } = useModel('BaiTap7.useTask');
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {
    if (!localStorage.getItem('th7_user')) {
      history.push('/bai-tap-7/dang-nhap');
    }
  }, []);

  if (!currentUser) return null;

  const filteredTasks = showAll 
    ? tasks 
    : tasks.filter(t => t.assignee === currentUser.username);

  const dateCellRender = (value: Dayjs) => {
    const listData = filteredTasks.filter(task => 
      dayjs(task.deadline).isSame(value, 'day')
    );

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item) => {
          // Xác định màu sắc Badge dựa trên trạng thái
          let badgeStatus: BadgeProps['status'] = 'processing'; 
          if (item.status === 'done') badgeStatus = 'success';
          if (item.status === 'todo') {
            badgeStatus = dayjs(item.deadline).isBefore(dayjs(), 'day') ? 'error' : 'warning';
          }

          return (
            <li key={item.id}>
              <Badge status={badgeStatus} text={item.title} />
            </li>
          );
        })}
      </ul>
    );
  };

  const cellRender = (current: Dayjs, info: any) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Lịch Công Việc</Title>
          <Space>
            <Text strong>Chế độ xem:</Text>
            <Switch 
              checkedChildren="Cả Nhóm" 
              unCheckedChildren="Của Tôi" 
              checked={showAll}
              onChange={setShowAll}
            />
          </Space>
        </div>
      </Card>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Text strong>Trạng thái:</Text>
            <Tag color="orange">Chưa làm</Tag>
            <Tag color="blue">Đang làm</Tag>
            <Tag color="green">Đã hoàn thành</Tag>
            <Tag color="red">Trễ hạn</Tag>
          </Space>
        </div>

        <Calendar cellRender={cellRender} />
      </Card>
    </div>
  );
};

export default CalendarPage;
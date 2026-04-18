import React, { useState, useEffect } from 'react';
import { Card, Calendar, Badge, Switch, Space, Typography, Tag } from 'antd';
import { useModel, history } from 'umi';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const CalendarPage = () => {
  const { currentUser } = useModel('BaiTap7.useAuth');
  const { tasks } = useModel('BaiTap7.useTask');
  
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('th7_user')) {
      history.push('/bai-tap-7/dang-nhap');
    }
  }, []);

  if (!currentUser) return null;

  const filteredTasks = showAll 
    ? tasks 
    : tasks.filter(t => t.assignee === currentUser.username);

  // LOGIC HIỂN THỊ (FIX CHUẨN XÁC VỚI MỌI PHIÊN BẢN ANT DESIGN)
  const dateCellRender = (value: any) => {
    if (!value) return null;
    
    // TUYỆT CHIÊU: Gọi trực tiếp hàm format của giá trị truyền vào (Bất kể nó là Moment hay Dayjs)
    const cellDateStr = typeof value.format === 'function' 
      ? value.format('YYYY-MM-DD') 
      : dayjs(value).format('YYYY-MM-DD');

    const listData = filteredTasks.filter(task => {
      const taskDateStr = dayjs(task.deadline).format('YYYY-MM-DD');
      return taskDateStr === cellDateStr;
    });

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item) => {
          let badgeStatus: 'success' | 'processing' | 'default' | 'error' | 'warning' = 'processing'; 
          if (item.status === 'done') badgeStatus = 'success';
          if (item.status === 'todo') {
            badgeStatus = dayjs(item.deadline).isBefore(dayjs(), 'day') ? 'error' : 'warning';
          }

          return (
            <li key={item.id} style={{ marginBottom: '4px' }}>
              <Badge status={badgeStatus} text={item.title} />
            </li>
          );
        })}
      </ul>
    );
  };

  // Dành cho Ant Design v5
  const cellRender: any = (current: any, info: any) => {
    if (info && info.type === 'date') return dateCellRender(current);
    if (info) return info.originNode;
    return null;
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

        {/* Bọc thép: Truyền cả 2 prop để Antd bản nào cũng nhận diện được */}
        <Calendar dateCellRender={dateCellRender} cellRender={cellRender} />
      </Card>
    </div>
  );
};

export default CalendarPage;
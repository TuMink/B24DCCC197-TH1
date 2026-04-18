import React from 'react';
import { Space, Select, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface FilterBarProps {
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onAddTask: () => void;
  filterStatus: string;
  filterAssignee: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onStatusChange,
  onAssigneeChange,
  onAddTask,
  filterStatus,
  filterAssignee,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <Space wrap>
        <Input.Search 
          placeholder="Tìm tên công việc..." 
          allowClear 
          onSearch={onSearch} 
          style={{ width: 220 }} 
        />
        
        <Select 
          value={filterStatus} 
          onChange={onStatusChange} 
          style={{ width: 140 }}
        >
          <Select.Option value="all">Mọi trạng thái</Select.Option>
          <Select.Option value="todo">Chưa làm</Select.Option>
          <Select.Option value="in-progress">Đang làm</Select.Option>
          <Select.Option value="done">Đã xong</Select.Option>
        </Select>

        <Select 
          value={filterAssignee} 
          onChange={onAssigneeChange} 
          style={{ width: 140 }}
        >
          <Select.Option value="all">Mọi người</Select.Option>
          <Select.Option value="me">Việc của tôi</Select.Option>
        </Select>
      </Space>

      <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
        Thêm công việc
      </Button>
    </div>
  );
};

export default FilterBar;
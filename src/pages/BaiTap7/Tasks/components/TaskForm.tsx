import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

interface Props {
  open: boolean;
  onCancel: () => void;
  editingTask: BaiTap7.Task | null; // Nếu null là Thêm mới, có data là Sửa
}

const TaskForm: React.FC<Props> = ({ open, onCancel, editingTask }) => {
  const [form] = Form.useForm();
  const { addTask, updateTask } = useModel('BaiTap7.useTask');

  // Đổ dữ liệu vào form mỗi khi mở lên
  useEffect(() => {
    if (open) {
      if (editingTask) {
        form.setFieldsValue({
          ...editingTask,
          deadline: dayjs(editingTask.deadline), // Format lại ngày cho DatePicker
        });
      } else {
        form.resetFields(); // Reset form nếu là thêm mới
      }
    }
  }, [open, editingTask, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const taskData = {
        title: values.title,
        assignee: values.assignee,
        priority: values.priority,
        deadline: values.deadline.format('YYYY-MM-DD'), // Đưa về chuỗi chuẩn
        status: values.status || 'todo',
      };

      if (editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask({ ...taskData, status: 'todo' }); // Mặc định mới tạo là 'todo'
      }
      onCancel();
    });
  };

  return (
    <Modal
      title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={open} // <--- Đã đổi thành visible để Antd bản này hiểu được
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Tên công việc" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="VD: Báo cáo thực hành tuần 7" />
        </Form.Item>

        <Form.Item name="assignee" label="Người được giao (Tên user)" rules={[{ required: true }]}>
          <Input placeholder="Nhập tên người thực hiện" />
        </Form.Item>

        <Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="low">Thấp</Select.Option>
            <Select.Option value="medium">Trung bình</Select.Option>
            <Select.Option value="high">Cao</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="deadline" label="Thời hạn (Deadline)" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
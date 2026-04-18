import { useState } from 'react';
import { message } from 'antd';
import { taskService } from '@/services/BaiTap7/taskService';

export default function useTask() {
  // Khởi tạo state bằng dữ liệu từ localStorage
  const [tasks, setTasks] = useState<BaiTap7.Task[]>(taskService.getTasks());

  // Hàm helper để vừa set State vừa lưu LocalStorage
  const updateAndSave = (newTasks: BaiTap7.Task[]) => {
    setTasks(newTasks);
    taskService.saveTasks(newTasks);
  };

  const addTask = (task: Omit<BaiTap7.Task, 'id' | 'createdAt'>) => {
    const newTask: BaiTap7.Task = {
      ...task,
      id: Date.now().toString(), // Tự sinh ID bằng timestamp
      createdAt: Date.now(),
    };
    updateAndSave([newTask, ...tasks]); // Thêm lên đầu danh sách
    message.success('Đã thêm công việc mới!');
  };

  const updateTask = (id: string, updatedData: Partial<BaiTap7.Task>) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, ...updatedData } : t);
    updateAndSave(newTasks);
    message.success('Đã cập nhật công việc!');
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    updateAndSave(newTasks);
    message.success('Đã xóa công việc!');
  };

  return { tasks, addTask, updateTask, deleteTask };
}
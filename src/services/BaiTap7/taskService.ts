const TASKS_KEY = 'th7_tasks';

export const taskService = {
  // Lấy toàn bộ danh sách công việc
  getTasks: (): BaiTap7.Task[] => {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  // Ghi đè danh sách công việc mới vào bộ nhớ
  saveTasks: (tasks: BaiTap7.Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
};
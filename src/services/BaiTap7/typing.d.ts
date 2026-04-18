declare namespace BaiTap7 {
  // 1. Dữ liệu Người dùng (Chỉ cần tên theo yêu cầu đề)
  export interface User {
    username: string;
  }

  // 2. Các trạng thái và độ ưu tiên (Dùng tiếng Anh cho dễ code, hiển thị tiếng Việt sau)
  export type Priority = 'low' | 'medium' | 'high'; // Thấp | Trung bình | Cao
  export type Status = 'todo' | 'in-progress' | 'done'; // Chưa làm | Đang làm | Đã xong

  // 3. Dữ liệu Công việc
  export interface Task {
    id: string;
    title: string;          // Tên công việc
    assignee: string;       // Người được giao
    priority: Priority;     // Mức độ ưu tiên
    deadline: string;       // Thời hạn hoàn thành (Định dạng chuỗi YYYY-MM-DD)
    status: Status;         // Trạng thái
    createdAt: number;      // Thời gian tạo (để sắp xếp nếu cần)
  }
}
import { useState } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { authService } from '@/services/BaiTap7/authService';

export default function useAuth() {
  // Khởi tạo state bằng dữ liệu đã lưu trong máy (nếu có)
  const [currentUser, setCurrentUser] = useState<BaiTap7.User | null>(authService.getUser());

  // Hàm xử lý khi người dùng ấn Đăng nhập
  const login = (username: string) => {
    const user: BaiTap7.User = { username };
    setCurrentUser(user);
    authService.saveUser(user); // Lưu vào máy
    
    message.success(`Chào mừng ${username} đã quay trở lại!`);
    history.push('/bai-tap-7/cong-viec'); // Chuyển sang trang danh sách
  };

  // Hàm xử lý khi người dùng ấn Đăng xuất
  const logout = () => {
    setCurrentUser(null);
    authService.removeUser(); // Xóa khỏi máy
    message.info('Đã đăng xuất khỏi hệ thống.');
    history.push('/bai-tap-7/dang-nhap');
  };

  return { currentUser, login, logout };
}
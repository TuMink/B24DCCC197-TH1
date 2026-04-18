const USER_KEY = 'th7_user';

export const authService = {
  // Đọc user từ localStorage
  getUser: (): BaiTap7.User | null => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  // Lưu user vào localStorage
  saveUser: (user: BaiTap7.User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Xóa sạch user khi đăng xuất
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  }
};
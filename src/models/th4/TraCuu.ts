import { useState } from 'react';
import { message } from 'antd';

export default () => {
  const [ketQua, setKetQua] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTraCuu = async (params: any) => {
    setLoading(true);
    try {
      // Biến object params thành chuỗi query url (?maSV=...&hoTen=...)
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/mock-api/tra-cuu?${queryParams}`);
      const res = await response.json();

      if (res.success) {
        setKetQua(res.data);
        if (res.data.length === 0) message.info('Không tìm thấy văn bằng nào khớp với thông tin!');
        else message.success(`Tra cứu thành công! Tìm thấy ${res.data.length} kết quả.`);
      } else {
        message.error(res.message); // Báo lỗi nếu thiếu tham số
      }
    } catch (err) {
      message.error('Lỗi kết nối đến máy chủ tra cứu!');
    }
    setLoading(false);
  };

  return { ketQua, setKetQua, loading, handleTraCuu };
};
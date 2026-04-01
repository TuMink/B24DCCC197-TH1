import React from 'react';
import styles from './style.less';

const AdminPage = () => {
  return (
    <div className={styles.container}>
      <h2>Trang Quản Trị (Admin)</h2>
      <p>Khu vực quản lý (Thêm/Sửa/Xóa) điểm đến và xem thống kê doanh thu.</p>
    </div>
  );
};

export default AdminPage;
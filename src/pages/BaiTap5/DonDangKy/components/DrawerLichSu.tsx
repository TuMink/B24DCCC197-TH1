// Đường dẫn: src/pages/BaiTap5/DonDangKy/DrawerLichSu.tsx
import React from 'react';
import { Drawer, Timeline, Typography, Tag } from 'antd';
import { IDonDangKy } from '@/models/bt5/interfaces';

const { Text } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
  record: IDonDangKy | null;
}

const DrawerLichSu: React.FC<Props> = ({ visible, onClose, record }) => {
  if (!record) return null;

  return (
    <Drawer 
      title={`Lịch sử thao tác - ${record.hoTen}`} 
      placement="right" 
      onClose={onClose} 
      visible={visible} // SỬA Ở ĐÂY: Đổi open thành visible
      width={400}
    >
      <Timeline>
        {record.lichSuThaoTac?.map((item) => {
          let color = 'blue';
          if (item.hanhDong === 'Approved') color = 'green';
          if (item.hanhDong === 'Rejected') color = 'red';

          return (
            <Timeline.Item key={item.id} color={color}>
              <p>
                <Text strong>{item.thoiGian}</Text> - Thực hiện bởi: <Text mark>{item.nguoiThucHien}</Text>
              </p>
              <p>
                Hành động: <Tag color={color}>{item.hanhDong}</Tag>
              </p>
              <p>
                Ghi chú: <Text italic>{item.lyDo}</Text>
              </p>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Drawer>
  );
};

export default DrawerLichSu;
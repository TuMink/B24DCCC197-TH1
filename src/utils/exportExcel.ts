import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  // 1. Format lại data cho đẹp trước khi xuất (Dịch key sang tiếng Việt)
  const formattedData = data.map((item, index) => ({
    'STT': index + 1,
    'Tên Câu Lạc Bộ': item.tenCLB || '',
    'Chủ Nhiệm': item.chuNhiem || '',
    'Ngày Thành Lập': item.ngayThanhLap || '',
    'Trạng Thái': item.hoatDong ? 'Đang hoạt động' : 'Ngừng hoạt động',
  }));

  // 2. Tạo Sheet từ Data
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // 3. Chỉnh độ rộng cột cho đẹp
  worksheet['!cols'] = [
    { wch: 5 },  // STT
    { wch: 30 }, // Tên CLB
    { wch: 25 }, // Chủ nhiệm
    { wch: 15 }, // Ngày thành lập
    { wch: 20 }, // Trạng thái
  ];

  // 4. Tạo Workbook và xuất file
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_CLB');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
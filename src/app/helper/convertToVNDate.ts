export function convertToVietnameseDate(datetimeStr: string): string {
  // Kiểm tra input hợp lệ
  if (!datetimeStr || typeof datetimeStr !== 'string') {
    return 'N/A';
  }

  // Nếu chuỗi đã có múi giờ (+hh:mm hoặc Z) thì giữ nguyên,
  // còn không thì coi nó là UTC (thêm 'Z')
  const fixedStr = /([+-]\d{2}:\d{2}|Z)$/.test(datetimeStr)
    ? datetimeStr
    : datetimeStr + 'Z';

  const date = new Date(fixedStr);
  
  // Kiểm tra xem date có hợp lệ không
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', datetimeStr);
    return 'N/A';
  }

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      // hiển thị theo giờ VN
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'N/A';
  }
}
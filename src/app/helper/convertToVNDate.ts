export function convertToVietnameseDate(datetimeStr: string): string {
  if (!datetimeStr || typeof datetimeStr !== 'string') return 'N/A';

  const normalized = datetimeStr.replace(' ', 'T'); // handle "YYYY-MM-DD HH:mm"
  const hasTZ = /([+-]\d{2}:\d{2}|Z)$/.test(normalized);
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(normalized);
  const isDateTimeNoTZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(normalized);

  let date: Date;

  try {
    // 1) Has timezone: use as-is
    if (hasTZ) {
      date = new Date(normalized);
    }
    // 2) Date-only: parse as local date, and show only date (no time)
    else if (isDateOnly) {
      date = new Date(normalized);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    }
    // 3) Date-time without timezone: treat as local time (do NOT append Z)
    else if (isDateTimeNoTZ) {
      date = new Date(normalized);
    }
    // 4) Fallback: use as-is
    else {
      date = new Date(normalized);
    }

    if (isNaN(date.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch {
    return 'N/A';
  }
}
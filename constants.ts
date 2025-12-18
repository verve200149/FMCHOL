
import { ScheduleEntry } from './types';

export const OFFSETS = {
  Panama: -5,
  Taiwan: 8,
  GMT: 0,
};

// 嚴格根據官方表格定義的 UTC 時間窗
export const HOLIDAY_WINDOWS: ScheduleEntry[] = [
  // --- 2025/12/24 (巴拿馬時間) ---
  {
    status: 'Non-Working',
    panamaStart: new Date('2025-12-24T00:00:00-05:00'),
    panamaEnd: new Date('2025-12-24T06:00:00-05:00'),
    note: 'Early Morning'
  },
  {
    status: 'Working',
    panamaStart: new Date('2025-12-24T06:00:00-05:00'),
    panamaEnd: new Date('2025-12-24T13:30:00-05:00'),
    note: 'Shift 1'
  },
  {
    status: 'Non-Working',
    panamaStart: new Date('2025-12-24T13:30:00-05:00'),
    panamaEnd: new Date('2025-12-24T14:00:00-05:00'),
    note: 'Break'
  },
  {
    status: 'Working',
    panamaStart: new Date('2025-12-24T14:00:00-05:00'),
    panamaEnd: new Date('2025-12-24T21:00:00-05:00'),
    note: 'Shift 2'
  },
  {
    status: 'Non-Working',
    panamaStart: new Date('2025-12-24T21:00:00-05:00'),
    panamaEnd: new Date('2025-12-24T23:59:59-05:00'),
    note: 'Late Night'
  },
  
  // --- 2025/12/25 (巴拿馬全天假日) ---
  {
    status: 'Holiday',
    panamaStart: new Date('2025-12-25T00:00:00-05:00'),
    panamaEnd: new Date('2025-12-25T23:59:59-05:00'),
    note: 'Full Holiday'
  },
  
  // --- 2025/12/31 (巴拿馬時間) ---
  {
    status: 'Non-Working',
    panamaStart: new Date('2025-12-31T00:00:00-05:00'),
    panamaEnd: new Date('2025-12-31T06:00:00-05:00'),
    note: 'Early Morning'
  },
  {
    status: 'Working',
    panamaStart: new Date('2025-12-31T06:00:00-05:00'),
    panamaEnd: new Date('2025-12-31T13:30:00-05:00'),
    note: 'Shift 1'
  },
  {
    status: 'Non-Working',
    panamaStart: new Date('2025-12-31T13:30:00-05:00'),
    panamaEnd: new Date('2025-12-31T14:00:00-05:00'),
    note: 'Break'
  },
  {
    status: 'Working',
    panamaStart: new Date('2025-12-31T14:00:00-05:00'),
    panamaEnd: new Date('2025-12-31T21:00:00-05:00'),
    note: 'Shift 2'
  },
  {
    status: 'Non-Working',
    panamaStart: new Date('2025-12-31T21:00:00-05:00'),
    panamaEnd: new Date('2025-12-31T23:59:59-05:00'),
    note: 'Late Night'
  },
  
  // --- 2026/01/01 (巴拿馬全天假日) ---
  {
    status: 'Holiday',
    panamaStart: new Date('2026-01-01T00:00:00-05:00'),
    panamaEnd: new Date('2026-01-01T23:59:59-05:00'),
    note: 'New Year Holiday'
  }
];

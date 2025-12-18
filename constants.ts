
import { ScheduleEntry } from './types';

export const OFFSETS = {
  Panama: -5,
  Taiwan: 8,
  GMT: 0,
};

// Precise holiday windows in UTC
export const HOLIDAY_WINDOWS: ScheduleEntry[] = [
  // Dec 24: Partial Working Day Breakdown
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
  
  // Dec 25 Holiday
  {
    status: 'Holiday',
    panamaStart: new Date('2025-12-25T00:00:00-05:00'),
    panamaEnd: new Date('2025-12-25T23:59:59-05:00'),
    note: 'Full Holiday'
  },
  
  // Dec 31: Partial Working Day Breakdown
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
  
  // Jan 1 Holiday
  {
    status: 'Holiday',
    panamaStart: new Date('2026-01-01T00:00:00-05:00'),
    panamaEnd: new Date('2026-01-01T23:59:59-05:00'),
    note: 'Full Holiday'
  }
];

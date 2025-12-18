
import { OFFSETS, HOLIDAY_WINDOWS } from '../constants';

export const getZoneTime = (date: Date, offset: number): Date => {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * offset));
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getFMCStatus = (date: Date): { status: 'Working' | 'Non-Working' | 'Holiday', note?: string } => {
  const checkTime = date.getTime();
  
  for (const window of HOLIDAY_WINDOWS) {
    if (checkTime >= window.panamaStart.getTime() && checkTime <= window.panamaEnd.getTime()) {
      return { status: window.status, note: window.note };
    }
  }

  const panamaDate = getZoneTime(date, -5);
  const day = panamaDate.getDate();
  const month = panamaDate.getMonth();
  const year = panamaDate.getFullYear();

  if ((month === 11 && day === 25) || (month === 0 && day === 1)) {
    return { status: 'Holiday' };
  }

  if ((month === 11 && (day === 24 || day === 31))) {
    return { status: 'Non-Working' };
  }

  return { status: 'Working' };
};

export interface UpcomingHoliday {
  startsInHours: number;
  startTime: Date;
  status: string;
}

export const getUpcomingHolidayInfo = (now: Date): UpcomingHoliday | null => {
  const checkTime = now.getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  // Find the next non-working or holiday window
  const upcoming = HOLIDAY_WINDOWS
    .filter(w => w.status !== 'Working' && w.panamaStart.getTime() > checkTime)
    .sort((a, b) => a.panamaStart.getTime() - b.panamaStart.getTime())[0];

  if (upcoming) {
    const diff = upcoming.panamaStart.getTime() - checkTime;
    if (diff <= twentyFourHours) {
      return {
        startsInHours: Math.floor(diff / (1000 * 60 * 60)),
        startTime: upcoming.panamaStart,
        status: upcoming.status
      };
    }
  }
  return null;
};

export const calculateSafeDeadline = (targetDate: Date): Date => {
  let deadline = new Date(targetDate.getTime() - (4 * 24 * 60 * 60 * 1000));
  while (getFMCStatus(deadline).status !== 'Working') {
    deadline = new Date(deadline.getTime() - (1 * 60 * 60 * 1000));
  }
  return deadline;
};

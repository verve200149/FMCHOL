
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
  
  // 1. 首先檢查是否有定義在 HOLIDAY_WINDOWS 中的特殊排班 (這包含了 12/24, 12/25, 12/31, 01/01)
  for (const window of HOLIDAY_WINDOWS) {
    if (checkTime >= window.panamaStart.getTime() && checkTime <= window.panamaEnd.getTime()) {
      return { status: window.status, note: window.note };
    }
  }

  // 2. 如果不在特殊窗口內，檢查是否為週末 (巴拿馬時間)
  const panamaDate = getZoneTime(date, OFFSETS.Panama);
  const dayOfWeek = panamaDate.getDay(); // 0 is Sunday, 6 is Saturday
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { status: 'Non-Working', note: 'Weekend' };
  }

  // 3. 預設為正常工作時間
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

  // 尋找下一個非工作或假日窗口
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
  // 從目標日期往前推 4 天
  let deadline = new Date(targetDate.getTime() - (4 * 24 * 60 * 60 * 1000));
  
  // 如果該點不是工作時間，則繼續往前回溯，直到找到最近的工作窗口
  let safetyCounter = 0;
  while (getFMCStatus(deadline).status !== 'Working' && safetyCounter < 500) {
    deadline = new Date(deadline.getTime() - (1 * 60 * 60 * 1000));
    safetyCounter++;
  }
  return deadline;
};

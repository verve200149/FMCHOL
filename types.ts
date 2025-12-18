
export type TimeZone = 'Panama' | 'Taiwan' | 'GMT';

export interface ScheduleEntry {
  status: 'Working' | 'Non-Working' | 'Holiday';
  panamaStart: Date;
  panamaEnd: Date;
  note?: string;
}

export interface CalculationResult {
  targetDate: Date;
  safeSubmissionDate: Date;
  isInsideHoliday: boolean;
  warnings: string[];
}

import React, { useState } from 'react';
import { calculateSafeDeadline, getZoneTime, formatTime, formatDateShort, getFMCStatus } from '../utils/timeUtils.ts';
import { OFFSETS } from '../constants.ts';
import { Calendar, AlertTriangle, CheckCircle, Info } from 'https://esm.sh/lucide-react@0.463.0?external=react';
import { Language } from '../App.tsx';

interface DeadlinePlannerProps {
  lang: Language;
}

const translations = {
  zh: {
    title: "預報截止時間計算器",
    subtitle: "選擇預計作業日期，計算最晚提交時間。",
    dateLabel: "預計作業日期 (當地)",
    timeLabel: "時間 (當地)",
    warningTitle: "注意：FMC 巴拿馬在您的目標日期處於 {status} 狀態。",
    warningDesc: "假期期間的作業可能會面臨明顯延誤。請確保所有申請都已提前處理。",
    resultLabel: "建議最晚提交時間",
    ptLabel: "巴拿馬時間 (UTC-5)",
    twLabel: "台灣時間 (UTC+8)",
    info: "計算方式為目標日期的 4 天前，並調整至最近的前一個 FMC 工作窗口。請將此作為 ARAP 郵件提交的最後截止點。"
  },
  en: {
    title: "Submission Deadline Calculator",
    subtitle: "Select your intended operation date to find the recommended submission time.",
    dateLabel: "Intended Operation Date (Local)",
    timeLabel: "Time (Local)",
    warningTitle: "Attention: FMC Panama is {status} on your target date.",
    warningDesc: "Operations during holidays may face significant delays. Ensure all applications are processed well in advance.",
    resultLabel: "Recommended Latest Submission",
    ptLabel: "Panama Time (UTC-5)",
    twLabel: "Taiwan Time (UTC+8)",
    info: "Calculated as 4 days prior to target date, adjusted to the nearest preceding FMC working window. Use this as your final cutoff for ARAP email submissions."
  }
};

const DeadlinePlanner: React.FC<DeadlinePlannerProps> = ({ lang }) => {
  const [targetDate, setTargetDate] = useState('2025-12-28');
  const [targetTime, setTargetTime] = useState('12:00');
  const t = translations[lang];

  const combinedDate = new Date(`${targetDate}T${targetTime}:00`);
  const safeDeadline = calculateSafeDeadline(combinedDate);
  const targetStatus = getFMCStatus(combinedDate);

  const deadlineInPanama = getZoneTime(safeDeadline, OFFSETS.Panama);
  const deadlineInTaiwan = getZoneTime(safeDeadline, OFFSETS.Taiwan);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          {t.title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.dateLabel}</label>
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.timeLabel}</label>
            <input 
              type="time" 
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {targetStatus.status !== 'Working' && (
          <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold">{t.warningTitle.replace('{status}', targetStatus.status)}</p>
              <p>{t.warningDesc}</p>
            </div>
          </div>
        )}

        <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
          <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {t.resultLabel}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-indigo-200 mb-1">{t.ptLabel}</p>
              <p className="text-3xl font-bold font-mono leading-none">{formatTime(deadlineInPanama)}</p>
              <p className="text-sm mt-1 opacity-90">{formatDateShort(deadlineInPanama)}</p>
            </div>
            <div className="md:border-l md:border-indigo-400 md:pl-6">
              <p className="text-xs text-indigo-200 mb-1">{t.twLabel}</p>
              <p className="text-3xl font-bold font-mono leading-none">{formatTime(deadlineInTaiwan)}</p>
              <p className="text-sm mt-1 opacity-90">{formatDateShort(deadlineInTaiwan)}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-indigo-500 flex items-start gap-2 text-xs text-indigo-100">
            <p>{t.info}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlinePlanner;
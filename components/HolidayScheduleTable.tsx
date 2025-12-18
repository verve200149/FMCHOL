import React from 'react';
import { Language } from '../App.tsx';

interface HolidayScheduleTableProps {
  lang: Language;
}

const translations = {
  zh: {
    title: "官方 FMC 運作時間表",
    subtitle: "2025年12月與2026年1月排班細節",
    headerStatus: "狀態",
    headerPT: "巴拿馬 (UTC-5)",
    headerTW: "台灣 (UTC+8)",
    headerGMT: "GMT (UTC±0)",
    working: "工作時間",
    nonworking: "非工作時間",
    holiday: "國定假日 (暫停作業)",
    note: "註：2025年12月26日及2026年1月2日恢復正常運作。"
  },
  en: {
    title: "Official FMC Operating Schedule",
    subtitle: "Dec 2025 & Jan 2026 Shift Breakdown",
    headerStatus: "Status",
    headerPT: "Panama (UTC-5)",
    headerTW: "Taiwan (UTC+8)",
    headerGMT: "GMT (UTC±0)",
    working: "Working Hours",
    nonworking: "Non-Working",
    holiday: "Holiday (Non-Working)",
    note: "Note: Normal operations resume on 26 Dec 2025 and 2 Jan 2026."
  }
};

const HolidayScheduleTable: React.FC<HolidayScheduleTableProps> = ({ lang }) => {
  const t = translations[lang];

  const schedule = [
    // Dec 24
    { status: t.nonworking, pt: '00:00 – 06:00 (24/Dec)', tw: '13:00 – 19:00 (24/Dec)', gmt: '05:00 – 11:00 (24/Dec)', color: 'bg-slate-50 text-slate-500 italic' },
    { status: t.working, pt: '06:00 – 13:30 (24/Dec)', tw: '19:00 (24/Dec) – 02:30 (25/Dec)', gmt: '11:00 – 18:30 (24/Dec)', color: 'bg-emerald-50 text-emerald-700 font-bold' },
    { status: t.working, pt: '14:00 – 21:00 (24/Dec)', tw: '03:00 – 10:00 (25/Dec)', gmt: '19:00 (24/Dec) – 02:00 (25/Dec)', color: 'bg-emerald-50 text-emerald-700 font-bold' },
    { status: t.nonworking, pt: '21:00 – 23:59 (24/Dec)', tw: '10:00 – 13:00 (25/Dec)', gmt: '02:00 – 05:00 (25/Dec)', color: 'bg-slate-50 text-slate-500 italic' },
    
    // Dec 25
    { status: t.holiday, pt: '00:00 – 23:59 (25/Dec)', tw: '13:00 (25/Dec) – 12:59 (26/Dec)', gmt: '05:00 (25/Dec) – 04:59 (26/Dec)', color: 'bg-rose-50 text-rose-700 font-black border-l-4 border-rose-500' },
    
    // Dec 31
    { status: t.nonworking, pt: '00:00 – 06:00 (31/Dec)', tw: '13:00 – 19:00 (31/Dec)', gmt: '05:00 – 11:00 (31/Dec)', color: 'bg-slate-50 text-slate-500 italic' },
    { status: t.working, pt: '06:00 – 13:30 (31/Dec)', tw: '19:00 (31/Dec) – 02:30 (01/Jan)', gmt: '11:00 – 18:30 (31/Dec)', color: 'bg-emerald-50 text-emerald-700 font-bold' },
    { status: t.working, pt: '14:00 – 21:00 (31/Dec)', tw: '03:00 – 10:00 (01/Jan)', gmt: '19:00 (31/Dec) – 02:00 (01/Jan)', color: 'bg-emerald-50 text-emerald-700 font-bold' },
    { status: t.nonworking, pt: '21:00 – 23:59 (31/Dec)', tw: '10:00 – 13:00 (01/Jan)', gmt: '02:00 – 05:00 (01/Jan)', color: 'bg-slate-50 text-slate-500 italic' },

    // Jan 1
    { status: t.holiday, pt: '00:00 – 23:59 (01/Jan)', tw: '13:00 (01/Jan) – 12:59 (02/Jan)', gmt: '05:00 (01/Jan) – 04:59 (02/Jan)', color: 'bg-rose-50 text-rose-700 font-black border-l-4 border-rose-500' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">{t.title}</h2>
        <p className="text-sm text-slate-500">{t.subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 border-b">{t.headerStatus}</th>
              <th className="p-4 border-b">{t.headerPT}</th>
              <th className="p-4 border-b">{t.headerTW}</th>
              <th className="p-4 border-b">{t.headerGMT}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {schedule.map((row, idx) => (
              <tr key={idx} className={`${row.color} border-b border-slate-100 last:border-0 hover:brightness-95 transition-all`}>
                <td className="p-4 whitespace-nowrap">{row.status}</td>
                <td className="p-4 font-mono whitespace-nowrap">{row.pt}</td>
                <td className="p-4 font-mono whitespace-nowrap">{row.tw}</td>
                <td className="p-4 font-mono whitespace-nowrap">{row.gmt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-amber-50 text-amber-800 text-xs flex items-center gap-2 italic">
        <span className="font-bold underline">Note:</span> {t.note}
      </div>
    </div>
  );
};

export default HolidayScheduleTable;
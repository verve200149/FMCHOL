import React from 'react';
import { getZoneTime, formatTime, formatDateShort, getFMCStatus } from '../utils/timeUtils.ts';
import { OFFSETS } from '../constants.ts';
import { Clock as ClockIcon, Anchor, Ship } from 'https://esm.sh/lucide-react@0.463.0?external=react';
import { Language } from '../App.tsx';

interface WorldClockProps {
  now: Date;
  isSimulating: boolean;
  lang: Language;
}

const statusMap = {
  zh: {
    'Working': '辦公時間 (Working)',
    'Non-Working': '非辦公時間 (Non-Working)',
    'Holiday': '國定假日 (Holiday)',
    'StatusLabel': 'FMC 巴拿馬狀態'
  },
  en: {
    'Working': 'Working Hours',
    'Non-Working': 'Non-Working Hours',
    'Holiday': 'Public Holiday',
    'StatusLabel': 'FMC Panama Status'
  }
};

const WorldClock: React.FC<WorldClockProps> = ({ now, isSimulating, lang }) => {
  const zones = [
    { name: 'Panama (UTC-5)', offset: OFFSETS.Panama, icon: <Anchor className="w-4 h-4" /> },
    { name: 'Taiwan (UTC+8)', offset: OFFSETS.Taiwan, icon: <Ship className="w-4 h-4" /> },
    { name: 'GMT (UTC+0)', offset: OFFSETS.GMT, icon: <ClockIcon className="w-4 h-4" /> },
  ];

  const currentFmcStatus = getFMCStatus(now);
  const sm = statusMap[lang];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const time = getZoneTime(now, zone.offset);
          return (
            <div key={zone.name} className={`p-4 rounded-xl shadow-sm border transition-colors duration-300 ${
              isSimulating ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className={`flex items-center gap-2 mb-1 text-sm font-medium ${isSimulating ? 'text-indigo-300' : 'text-slate-500'}`}>
                {zone.icon}
                {zone.name}
              </div>
              <div className="text-2xl font-bold font-mono">
                {formatTime(time)}
              </div>
              <div className={`text-xs ${isSimulating ? 'text-slate-500' : 'text-slate-400'}`}>
                {formatDateShort(time)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
        currentFmcStatus.status === 'Working' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
        currentFmcStatus.status === 'Non-Working' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
        'bg-rose-50 border-rose-200 text-rose-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isSimulating ? '' : 'animate-pulse'} ${
            currentFmcStatus.status === 'Working' ? 'bg-emerald-500' : 
            currentFmcStatus.status === 'Non-Working' ? 'bg-amber-500' : 
            'bg-rose-500'
          }`} />
          <span className="font-semibold">{sm.StatusLabel}: {sm[currentFmcStatus.status]}</span>
        </div>
        {currentFmcStatus.note && (
          <span className="text-sm font-medium opacity-80 uppercase tracking-wider">{currentFmcStatus.note}</span>
        )}
      </div>
    </div>
  );
};

export default WorldClock;
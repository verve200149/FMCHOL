import React, { useEffect, useRef, useState, useMemo } from 'react';
import { formatDateShort, getZoneTime, getFMCStatus } from '../utils/timeUtils.ts';
import { OFFSETS } from '../constants.ts';
import { Play, Pause, CalendarDays, Clock, AlertCircle, Zap, Activity } from 'lucide-react';
import { Language } from '../App.tsx';

interface TimeTravelerProps {
  currentTime: Date;
  isSimulating: boolean;
  onToggleSimulation: (val: boolean) => void;
  onTimeChange: (newTime: Date) => void;
  lang: Language;
}

const translations = {
  zh: {
    title: "FMC 跨時空指揮中心",
    desc: "滑桿同步台灣時刻與巴拿馬排班，紅色區塊為禁區。",
    scrollHint: "滾輪跨日微調 (1小時/次)",
    stop: "結束模擬 (LIVE)",
    start: "啟動模擬模式",
    dateLabel: "台灣作業日期 (TW DATE)",
    sliderLabel: "FMC 運作狀態同步 (SYNCED WITH PANAMA)",
    dayChanged: "進入新的一天",
    statusWork: "工作 (WORK)",
    statusOff: "非工作 (OFF)",
    statusHol: "假日 (HOL)",
    panamaTimeLabel: "FMC 巴拿馬時區",
    twHandle: "台灣控制點"
  },
  en: {
    title: "FMC Command Center",
    desc: "Slider syncs TW time with Panama shifts. Red zones are dead zones.",
    scrollHint: "WHEEL TO JUMP DAYS (1h steps)",
    stop: "Exit Simulation (LIVE)",
    start: "Start Simulation",
    dateLabel: "Taiwan Date (TW DATE)",
    sliderLabel: "FMC Operational Status (SYNCED)",
    dayChanged: "New Day Detected",
    statusWork: "WORK",
    statusOff: "OFF",
    statusHol: "HOL",
    panamaTimeLabel: "FMC Panama Time",
    twHandle: "TW HANDLE"
  }
};

const TimeTraveler: React.FC<TimeTravelerProps> = ({ currentTime, isSimulating, onToggleSimulation, onTimeChange, lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFlash, setShowFlash] = useState(false);
  const flashTimeoutRef = useRef<number | null>(null);
  
  const twTime = getZoneTime(currentTime, OFFSETS.Taiwan);
  const panamaTime = getZoneTime(currentTime, OFFSETS.Panama);
  
  const dateString = twTime.toISOString().split('T')[0];
  const totalMinutesTW = twTime.getHours() * 60 + twTime.getMinutes();
  
  const { status: currentStatus } = getFMCStatus(currentTime);
  const t = translations[lang];

  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  const scheduleRibbon = useMemo(() => {
    const segments = [];
    const baseTW = new Date(twTime);
    baseTW.setHours(0, 0, 0, 0);
    
    for (let h = 0; h < 24; h++) {
      const segmentTW = new Date(baseTW);
      segmentTW.setHours(h);
      const utcCheck = new Date(segmentTW.getTime() - (OFFSETS.Taiwan * 3600000));
      const { status } = getFMCStatus(utcCheck);
      
      let color = 'bg-emerald-500'; 
      let glow = 'shadow-[inset_0_0_10px_rgba(16,185,129,0.3)]';
      if (status === 'Non-Working') {
        color = 'bg-amber-500';
        glow = 'shadow-[inset_0_0_15px_rgba(245,158,11,0.5)]';
      }
      if (status === 'Holiday') {
        color = 'bg-rose-600';
        glow = 'shadow-[inset_0_0_20px_rgba(225,29,72,0.6)] animate-pulse';
      }
      
      segments.push({ hour: h, color, glow, status });
    }
    return segments;
  }, [dateString, isSimulating]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleNativeWheel = (e: WheelEvent) => {
      if (!isSimulating) return;
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      const minutesToChange = 60; 
      
      const prevDate = getZoneTime(currentTimeRef.current, OFFSETS.Taiwan).getDate();
      const newTime = new Date(currentTimeRef.current.getTime() + (direction * minutesToChange * 60 * 1000));
      const nextDate = getZoneTime(newTime, OFFSETS.Taiwan).getDate();

      if (prevDate !== nextDate) {
        setShowFlash(true);
        if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = window.setTimeout(() => setShowFlash(false), 800);
      }
      onTimeChange(newTime);
    };

    element.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', handleNativeWheel);
      if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
    };
  }, [isSimulating, onTimeChange]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const twDate = getZoneTime(currentTime, OFFSETS.Taiwan);
    twDate.setFullYear(year, month - 1, day);
    const utcDate = new Date(twDate.getTime() - (OFFSETS.Taiwan * 3600000));
    onTimeChange(utcDate);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const twDate = getZoneTime(currentTime, OFFSETS.Taiwan);
    twDate.setHours(hours, mins, 0, 0);
    const utcDate = new Date(twDate.getTime() - (OFFSETS.Taiwan * 3600000));
    onTimeChange(utcDate);
  };

  const getStatusColorClass = () => {
    if (currentStatus === 'Working') return 'bg-emerald-500 text-white';
    if (currentStatus === 'Non-Working') return 'bg-amber-500 text-slate-900';
    return 'bg-rose-600 text-white animate-pulse shadow-[0_0_30px_rgba(225,29,72,0.6)]';
  };

  return (
    <div 
      ref={containerRef}
      className={`p-6 md:p-10 rounded-[3rem] border transition-all duration-700 relative group overflow-hidden ${
        isSimulating 
          ? showFlash 
            ? 'bg-indigo-950 border-amber-400 shadow-[0_0_100px_rgba(251,191,36,0.3)] scale-[1.01]' 
            : 'bg-slate-950 border-indigo-500/50 shadow-[0_0_50px_rgba(0,0,0,0.8)]' 
          : 'bg-white border-slate-200'
      }`}
    >
      <div className={`absolute inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-500 ${showFlash ? 'opacity-100 scale-100 backdrop-blur-xl' : 'opacity-0 scale-90 backdrop-blur-0'}`}>
        <div className="bg-amber-400 text-slate-950 px-12 py-8 rounded-[4rem] font-black text-4xl flex flex-col items-center gap-3 shadow-2xl border-8 border-white transform transition-transform">
          <Activity className="w-12 h-12 animate-spin text-indigo-900" />
          <span>{t.dayChanged}</span>
          <span className="text-lg font-mono tracking-[0.3em] bg-slate-950 text-white px-4 py-1 rounded-full">{formatDateShort(twTime)}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-14">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className={`font-black text-3xl tracking-tight ${isSimulating ? 'text-white' : 'text-slate-800'}`}>
              {t.title}
            </h3>
            {isSimulating && <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-lg animate-pulse uppercase tracking-widest">Active</span>}
          </div>
          <p className={`text-base font-bold tracking-tight max-w-lg ${isSimulating ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.desc}
          </p>
        </div>
        
        <button 
          onClick={() => onToggleSimulation(!isSimulating)}
          className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl active:scale-95 group ${
            isSimulating 
              ? 'bg-rose-600 text-white hover:bg-rose-700 ring-8 ring-rose-500/20' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 ring-8 ring-indigo-600/10'
          }`}
        >
          {isSimulating ? <Pause className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> : <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />}
          {isSimulating ? t.stop : t.start}
        </button>
      </div>

      <div className={`space-y-16 ${!isSimulating && 'opacity-20 pointer-events-none blur-[2px] grayscale'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="relative">
              <label className={`block text-[11px] font-black tracking-[0.3em] uppercase mb-4 ${isSimulating ? 'text-indigo-400' : 'text-slate-400'}`}>
                {t.dateLabel}
              </label>
              <div className="relative group">
                <input 
                  type="date" 
                  value={dateString}
                  min="2025-12-20"
                  max="2026-01-05"
                  onChange={handleDateChange}
                  className="w-full bg-slate-900 text-white border-2 border-slate-700 rounded-[2rem] p-6 font-black text-xl focus:ring-8 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none transition-all shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer"
                />
                <CalendarDays className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
               <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black text-indigo-300 tracking-widest uppercase">System Load</span>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${currentStatus === 'Working' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{currentStatus}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${currentStatus === 'Working' ? 'w-full bg-emerald-500' : 'w-1/3 bg-amber-500'}`} />
                  </div>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <label className={`text-[11px] font-black tracking-[0.2em] uppercase ${isSimulating ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {t.sliderLabel}
                  </label>
                  <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] text-emerald-400 font-black tracking-widest">{t.statusWork}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                    <span className="text-[10px] text-amber-400 font-black tracking-widest">{t.statusOff}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-[0_0_8px_#e11d48]" />
                    <span className="text-[10px] text-rose-400 font-black tracking-widest">{t.statusHol}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className={`mb-3 px-6 py-1.5 rounded-full text-xs font-black tracking-[0.1em] shadow-xl border-2 border-white/10 ${getStatusColorClass()}`}>
                  {currentStatus}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono font-black text-7xl leading-none tracking-tighter ${isSimulating ? 'text-white' : 'text-slate-800'}`}>
                    {twTime.getHours().toString().padStart(2, '0')}<span className="text-indigo-500 animate-pulse">:</span>{twTime.getMinutes().toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm font-black text-indigo-400 bg-indigo-500/10 px-2 rounded">TW</span>
                </div>
                <div className="text-xs font-bold text-slate-500 mt-4 flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
                   <Clock className="w-4 h-4 text-indigo-500" />
                   <span className="uppercase tracking-widest opacity-60 text-[10px]">{t.panamaTimeLabel}</span>
                   <span className="text-white font-mono text-base">{panamaTime.getHours().toString().padStart(2, '0')}:{panamaTime.getMinutes().toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <div className="relative h-28 flex items-center mt-10">
              <div className="absolute top-0 left-0 right-0 flex justify-between px-1 pointer-events-none">
                {[0, 4, 8, 12, 16, 20, 23].map(h => (
                  <div key={h} className="flex flex-col items-center">
                    <div className="w-px h-3 bg-slate-700 mb-2" />
                    <span className="text-[10px] font-black text-slate-500 font-mono tracking-tighter">{h.toString().padStart(2, '0')}:00</span>
                  </div>
                ))}
              </div>
              
              <div className="absolute top-10 left-0 right-0 h-10 w-full flex rounded-[1.25rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4),inset_0_4px_10px_rgba(0,0,0,0.5)] bg-slate-900 border-2 border-slate-800">
                {scheduleRibbon.map((seg) => (
                  <div 
                    key={seg.hour} 
                    className={`flex-1 ${seg.color} ${seg.glow} transition-all duration-300 border-r border-black/10 last:border-0`}
                  />
                ))}
              </div>

              <div 
                className="absolute -top-6 transition-all duration-300 pointer-events-none"
                style={{ left: `${(totalMinutesTW / 1440) * 100}%` }}
              >
                 <div className="absolute left-1/2 -translate-x-1/2 -top-10 flex flex-col items-center group">
                    <div className="bg-white text-slate-950 px-3 py-1 rounded-lg text-[10px] font-black whitespace-nowrap shadow-2xl animate-bounce">
                       {currentStatus} @ FMC
                    </div>
                    <div className="w-px h-4 bg-white/50" />
                 </div>
              </div>

              <input 
                type="range" 
                min="0" 
                max="1439" 
                step="1"
                value={totalMinutesTW}
                onChange={handleSliderChange}
                className="absolute inset-0 top-10 w-full h-10 bg-transparent appearance-none cursor-pointer accent-transparent z-40"
                style={{ WebkitAppearance: 'none' }}
              />
              
              <div 
                className="absolute top-8 pointer-events-none z-30 flex flex-col items-center transition-all duration-300"
                style={{ left: `${(totalMinutesTW / 1440) * 100}%` }}
              >
                <div className="w-1.5 h-14 bg-white rounded-full shadow-[0_0_30px_#fff,0_0_10px_#fff]">
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full whitespace-nowrap shadow-lg border border-indigo-400">
                      {t.twHandle}
                   </div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex items-center justify-center border-4 border-indigo-600">
                      <div className="w-1 h-1 bg-indigo-600 rounded-full animate-ping" />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex flex-col md:flex-row items-center gap-6 bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <AlertCircle className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-slate-400 leading-relaxed text-center md:text-left">
                {lang === 'zh' 
                  ? '注意：上方色帶已自動根據您的日期，將巴拿馬 FMC 的運作週期與台灣時間同步。紅色區塊代表該時段巴拿馬正處於國定假日，將完全停止作業。' 
                  : 'Notice: The ribbon above is now synced with Taiwan Time axis, reflecting FMC Panama status for that specific moment. Red blocks indicate full holiday shutdown in Panama.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {currentStatus !== 'Working' && (
        <div className="absolute inset-0 border-[6px] border-rose-600/20 rounded-[3rem] pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

export default TimeTraveler;
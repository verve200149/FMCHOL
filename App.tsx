
import React, { useState, useEffect } from 'react';
import WorldClock from './components/WorldClock.tsx';
import DeadlinePlanner from './components/DeadlinePlanner.tsx';
import HolidayScheduleTable from './components/HolidayScheduleTable.tsx';
import TimeTraveler from './components/TimeTraveler.tsx';
import { getUpcomingHolidayInfo, formatTime } from './utils/timeUtils.ts';
import { ShieldAlert, Mail, MapPin, Compass, AlertOctagon, Clock, Languages } from 'lucide-react';

export type Language = 'zh' | 'en';

const translations = {
  zh: {
    title: "巴拿馬 FMC 假期預報排程器",
    subtitle: "2025年12月 – 2026年1月。請確保所有 ARAP 郵件在非工作時間之外提交，以避免船舶延誤。",
    notice: "重要通知",
    approaching: "接近假期暫停作業",
    pauseText: "FMC 巴拿馬將在大約 {hours} 小時後暫停作業 ({time} PT)",
    simActive: "模擬模式運行中",
    actionRequired: "需立即採取行動",
    guideTitle: "快速作業指南",
    guide1Title: "提早 2-4 天規劃",
    guide1Desc: "儘早提交 ARAP 請求，避免假期期間 FMC 人手有限。",
    guide2Title: "避開非工作時間",
    guide2Desc: "12/25 和 1/1 提交的申請直到下個工作日才會處理。",
    guide3Title: "檢查時區",
    guide3Desc: "使用對照表核對巴拿馬時間與台灣或 GMT 時間。",
    needHelp: "需要協助？",
    helpDesc: "若對工作時段有任何疑問，請提前聯繫運作部門 (Operations Department)。",
    reminders: "作業重點提醒",
    rem1: "非工作時間和假期期間，ARAP 的回覆和批准可能會延遲。",
    rem2: "延遲提交可能導致申請被拒絕，進而影響船舶船期。",
    rem3: "船長需提前規劃船舶運作並與公司密切配合。",
    footer1: "© 2025 船舶運作 - 巴拿馬 FMC 假期排程資訊儀表板",
    footer2: "僅供內部航運運作使用。請務必交叉核對官方通告。"
  },
  en: {
    title: "FMC Panama Holiday Submission Planner",
    subtitle: "Dec 2025 – Jan 2026. Ensure all ARAP email submissions are planned outside non-working hours to avoid vessel delays.",
    notice: "Important Notice",
    approaching: "CRITICAL: APPROACHING HOLIDAY",
    pauseText: "FMC Panama will pause operations in approx. {hours} hours ({time} PT)",
    simActive: "Simulation Active",
    actionRequired: "Immediate Action Required",
    guideTitle: "Quick Action Guide",
    guide1Title: "Plan 2-4 Days Ahead",
    guide1Desc: "Submit ARAP requests early to avoid FMC limited availability during holidays.",
    guide2Title: "Avoid Non-Working Hours",
    guide2Desc: "Submissions made on 25 Dec and 1 Jan will not be processed until the next working day.",
    guide3Title: "Check Your Time Zone",
    guide3Desc: "Use the table provided to verify Panama time against Taiwan or GMT time.",
    needHelp: "Need Assistance?",
    helpDesc: "Should there be any uncertainty regarding working windows, please contact the Operations Department in advance.",
    reminders: "Operational Key Reminders",
    rem1: "ARAP responses and approvals may be delayed during non-working hours and holidays.",
    rem2: "Late submissions may result in rejection, impacting vessel schedules significantly.",
    rem3: "Masters must plan vessel operations and coordinate with the Company closely.",
    footer1: "© 2025 Vessel Operations - FMC Panama Holiday Schedule Information Dashboard",
    footer2: "For Internal Maritime Operations Only. Always cross-reference with official circulars."
  }
};

const App: React.FC = () => {
  const [realTime, setRealTime] = useState(new Date());
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(new Date());
  const [lang, setLang] = useState<Language>('zh');
  
  const t = translations[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setRealTime(d);
      if (!isSimulating) {
        setSimulatedTime(d);
      }
    }, 1000); 
    return () => clearInterval(timer);
  }, [isSimulating]);

  const now = isSimulating ? simulatedTime : realTime;
  const upcomingWarning = getUpcomingHolidayInfo(now);

  const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* High Priority Warning Banner */}
      {upcomingWarning && (
        <div className="bg-red-600 text-white py-3 px-4 sticky top-0 z-50 shadow-xl animate-pulse">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-6 h-6 flex-shrink-0" />
              <div>
                <span className="font-black text-lg tracking-tight uppercase">{t.approaching}</span>
                <p className="text-xs opacity-90 font-medium">
                  {t.pauseText.replace('{hours}', upcomingWarning.startsInHours.toString()).replace('{time}', formatTime(upcomingWarning.startTime))}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-red-700 px-3 py-1 rounded-full border border-red-500 text-xs font-bold uppercase">
              <Clock className="w-3 h-3" />
              {isSimulating ? t.simActive : t.actionRequired}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 text-white pt-10 pb-20 relative overflow-hidden">
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-full transition-all text-sm font-bold text-indigo-300 shadow-lg"
          >
            <Languages className="w-4 h-4" />
            {lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>

        <div className="container mx-auto px-4 max-w-5xl text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <ShieldAlert className="w-6 h-6 text-indigo-400" />
                <span className="text-indigo-400 font-bold tracking-widest text-xs uppercase">{t.notice}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight whitespace-pre-line">
                {t.title}
              </h1>
              <p className="mt-3 text-slate-400 max-w-xl text-lg">
                {t.subtitle}
              </p>
            </div>
            <div className="hidden lg:block">
              <Compass className={`w-24 h-24 ${isSimulating ? 'text-indigo-500 animate-spin-slow' : 'text-slate-800'}`} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-5xl -mt-12 space-y-8">
        {/* Simulation Controls */}
        <section>
          <TimeTraveler 
            currentTime={now}
            isSimulating={isSimulating}
            onToggleSimulation={setIsSimulating}
            onTimeChange={setSimulatedTime}
            lang={lang}
          />
        </section>

        {/* Live Status Section */}
        <section>
          <WorldClock now={now} isSimulating={isSimulating} lang={lang} />
        </section>

        {/* Action Planner */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <DeadlinePlanner lang={lang} />
            <HolidayScheduleTable lang={lang} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Quick Tips */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                {t.guideTitle}
              </h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">1</div>
                  <p><span className="font-bold text-slate-800">{t.guide1Title}:</span> {t.guide1Desc}</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
                  <p><span className="font-bold text-slate-800">{t.guide2Title}:</span> {t.guide2Desc}</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
                  <p><span className="font-bold text-slate-800">{t.guide3Title}:</span> {t.guide3Desc}</p>
                </li>
              </ul>
            </div>

            {/* Support Box */}
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-3 text-indigo-800 font-bold">
                <Mail className="w-5 h-5" />
                {t.needHelp}
              </div>
              <p className="text-sm text-indigo-700 leading-relaxed">
                {t.helpDesc}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl text-slate-300">
              <p className="text-xs uppercase font-bold tracking-widest mb-4 opacity-50">{t.reminders}</p>
              <ul className="list-disc ml-4 space-y-2 text-xs opacity-80 leading-relaxed">
                <li>{t.rem1}</li>
                <li>{t.rem2}</li>
                <li>{t.rem3}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            {t.footer1}
          </p>
          <p className="text-slate-300 text-xs mt-1">
            {t.footer2}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

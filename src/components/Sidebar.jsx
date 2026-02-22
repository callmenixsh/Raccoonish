import { Coins, Play, X, RotateCw, Menu, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar({ tabs, active, setActive, speedrunActive, speedrunElapsed, startSpeedrun, abortSpeedrun, restartSpeedrun, unlockAchievement }) {
  const coins = typeof window !== 'undefined' && window.localStorage.getItem('achievements')
    ? JSON.parse(window.localStorage.getItem('achievements')).length
    : 0;
  const formatTime = (ms) => { 
    if (!ms) return '--:--.---';
    const total = Math.floor(ms);
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const millis = total % 1000;
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(millis).padStart(3,'0')}`;
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try { window.localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-900 dark:to-gray-800 shadow-xl flex-col items-center py-10 z-20 border-r border-slate-300 dark:border-gray-700">
        <div className="mb-10 flex flex-col items-center">
          <img src="/raccoonish.png" alt="Raccoonish" className="w-12 h-12 mb-2 cursor-pointer hover:scale-105 transition" onClick={() => { if (unlockAchievement) unlockAchievement('secret_logo_click'); }} />
          <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Raccoonish</div>
          <div className="mt-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-lg">
            <Coins size={20} className="text-amber-400 cursor-pointer" onClick={() => { if (unlockAchievement) unlockAchievement('secret_sidebar_coin'); }} />
            <span>{coins}</span>
          </div>
        </div>
        <nav className="flex flex-col gap-2 w-full px-4">
          {tabs.map((tab, i) => {
            const sidebarColors = [
              'bg-slate-700/90',
              'bg-indigo-700/90',
              'bg-emerald-700/90',
              'bg-amber-700/90',
              'bg-gray-700/90',
              'bg-stone-700/90',
            ];
            return (
              <button
                key={tab.label}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition text-lg shadow ${active === i ? sidebarColors[i % sidebarColors.length] + ' text-white dark:bg-gray-700' : 'hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-900'} hover:scale-105`}
                onClick={() => setActive(i)}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}{tab.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto w-full px-4 pt-6 pb-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-2 shadow flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-300">{speedrunActive ? formatTime(speedrunElapsed) : '--:--.---'}</div>
            <div className="flex items-center gap-2">
              {!speedrunActive ? (
                <button onClick={startSpeedrun} className="px-2 py-1 bg-amber-400 text-white rounded text-sm">Start</button>
              ) : (
                <>
                  <button onClick={abortSpeedrun} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Abort</button>
                  <button onClick={restartSpeedrun} className="px-2 py-1 bg-amber-300 text-white rounded text-sm">Restart</button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-4">
          <button aria-label="Toggle theme" onClick={toggleTheme} className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 z-30 flex items-center px-3 justify-between">
        <div className="flex items-center gap-3">
          <button aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-gray-800 dark:text-amber-300">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <img src="/raccoonish.png" alt="Raccoonish" className="w-9 h-9 cursor-pointer" onClick={() => { if (unlockAchievement) unlockAchievement('secret_logo_click'); }} />
        </div>
        <div className="flex items-center gap-3">
          {speedrunActive && (
            <div className="text-sm font-mono text-slate-700 dark:text-slate-200 mr-1">{formatTime(speedrunElapsed)}</div>
          )}
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
            <Coins className="text-amber-400 cursor-pointer" size={18} onClick={() => { if (unlockAchievement) unlockAchievement('secret_sidebar_coin'); }} />
            <span className="text-sm">{coins}</span>
          </div>
        </div>
      </header>

        <div aria-hidden={!mobileOpen} className={`${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
          <aside className={`fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 p-4 shadow-xl transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="/raccoonish.png" alt="Raccoonish" className="w-10 h-10" />
                <div className="font-bold text-slate-800 dark:text-white">Raccoonish</div>
              </div>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-1 rounded-md">
                <X size={18} />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-lg">
                <Coins size={20} className="text-amber-400 cursor-pointer" onClick={() => { if (unlockAchievement) unlockAchievement('secret_sidebar_coin'); }} />
                <span>{coins}</span>
              </div>
            </div>
            <nav className="flex flex-col gap-2 w-full">
              {tabs.map((tab, i) => (
                <button key={tab.label} onClick={() => { setActive(i); setMobileOpen(false); }} className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition text-lg shadow ${active === i ? 'bg-amber-400 text-white dark:bg-gray-700' : 'hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-900'}`}>
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}{tab.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-2 shadow flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-300">{speedrunActive ? formatTime(speedrunElapsed) : '--:--.---'}</div>
                <div className="flex items-center gap-2">
                  {!speedrunActive ? (
                    <button onClick={() => { startSpeedrun(); setMobileOpen(false); }} className="px-2 py-1 bg-amber-400 text-white rounded text-sm">Start</button>
                  ) : (
                    <>
                      <button onClick={() => { abortSpeedrun(); setMobileOpen(false); }} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Abort</button>
                      <button onClick={() => { restartSpeedrun(); setMobileOpen(false); }} className="px-2 py-1 bg-amber-300 text-white rounded text-sm">Restart</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center mt-4">
              <button aria-label="Toggle theme" onClick={() => { toggleTheme(); setMobileOpen(false); }} className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </aside>
        </div>
    </>
  );
}

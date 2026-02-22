import { Coins, Lock } from 'lucide-react';

export default function AchievementList({ achievements, unlocked, bestSpeedrun, unlockAchievement }) {
  const pastelColors = [
    'bg-slate-300', 'bg-slate-400', 'bg-stone-300', 'bg-indigo-300', 'bg-amber-300', 'bg-emerald-300', 'bg-slate-200', 'bg-gray-300', 'bg-yellow-200', 'bg-cyan-200'
  ];

  const special = achievements.filter(a => a.id.startsWith('milestone_') || a.id === 'hidden_51');
  const regular = achievements.filter(a => !special.includes(a));

  const total = achievements.length;
  const collected = unlocked.length;
  const progress = Math.round((collected / total) * 100);

  const formatTime = (ms) => {
    if (ms == null) return '--:--.---';
    const total = Math.floor(ms);
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const millis = total % 1000;
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(millis).padStart(3,'0')}`;
  };

  const coinIcons = {1: '🪙', 10: '🥇', 20: '🦝', 30: '🏅', 50: '👑', 100: '💎', 150: '✨', 200: '🥀', 500: '💀', 1000: '🪽'};
  const coinForId = (id) => {
    if (id === 'hidden_51') return '🦝';
    if (id.startsWith('milestone_')) {
      const n = parseInt(id.split('_')[1], 10);
      return coinIcons[n] || '🪙';
    }
    return '🪙';
  };

  const renderCoin = (ach, idx) => {
    const isUnlocked = unlocked.includes(ach.id);
    const bg = isUnlocked ? pastelColors[idx % pastelColors.length] : 'bg-gray-100';
    const border = isUnlocked ? 'border-slate-300' : 'border-gray-200';
    const textColor = isUnlocked ? 'text-slate-800' : 'text-gray-400';
    return (
      <li
        key={ach.id}
        title={ach.name}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm border ${bg} ${border} ${textColor} transition duration-200 hover:scale-110`}
      >
        {isUnlocked
          ? (special.includes(ach) ? <span className="text-2xl">{coinForId(ach.id)}</span> : <Coins className="text-amber-500" size={18} />)
          : <Lock className="text-gray-300" size={16} />}
      </li>
    );
  };

  return (
    <div className="w-full max-w-4xl bg-white/80 dark:bg-gray-800 rounded-2xl shadow-xl p-6 dark:text-slate-200">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <Coins className="text-amber-400 cursor-pointer" size={28} onClick={() => { if (unlockAchievement) unlockAchievement('secret_index_coin'); }} />
          <span className="hidden sm:inline">Coin Index</span>
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-300">{collected} / {total} collected</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Best: <span className="font-mono">{bestSpeedrun ? formatTime(bestSpeedrun) : '--:--.---'}</span></div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 text-slate-500 text-xs text-center">No hints — explore and discover coins hidden throughout the playground.</div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">Special Coins</div>
          <div className="text-xs text-slate-500">{special.length} total</div>
        </div>
        <ul className="flex gap-3 mb-4 flex-wrap justify-center">
          {special.map((ach, i) => renderCoin(ach, i))}
        </ul>

        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">Hidden Coins</div>
          <div className="text-xs text-slate-500">{regular.length} total</div>
        </div>
        <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 justify-items-center mt-2">
          {regular.map((ach, i) => renderCoin(ach, i))}
        </ul>
      </div>
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-300">
        This is just the start, a lot more is yet to come.. stay tuned
      </div>
    </div>
  );
}

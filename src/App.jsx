
import { useState, useEffect, useRef } from 'react';
import { Gamepad, Trophy as LucideTrophy, Info, Coins } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tabs from './components/Tabs';
import AchievementList from './components/AchievementList';
import SecretButtons from './components/SecretButtons';
import EasterElements from './components/EasterElements';
import Sidebar from './components/Sidebar';

import BunnyIntro from './components/Intro';

const MILESTONE_THRESHOLDS = [1, 10, 20, 30, 50, 100, 150, 200];

const BASE_HIDDEN = Array.from({ length: 51 }, (_, i) => ({
  id: `hidden_${i+1}`,
  name: i < 50 ? `Hidden Achievement #${i+1}` : `Raccoon's Special Coin`,
  description: i < 50 ? 'You have discovered a hidden achievement!' : "You found the raccoon guide's special coin!"
}));

const MILESTONE_ACHIEVEMENTS = MILESTONE_THRESHOLDS.map(m => ({
  id: `milestone_${m}`,
  name: `Milestone Reward: ${m} coins`,
  description: `Awarded for reaching ${m} coins.`
}));
const SECRET_ACHIEVEMENTS = [
  { id: 'secret_logo_click', name: 'Logo Tap', description: 'You clicked the Raccoonish logo.' },
  { id: 'secret_sidebar_coin', name: 'Counter Tap', description: 'You tapped the coin counter in the sidebar.' },
  { id: 'secret_footer_coin', name: 'Footer Tap', description: 'You clicked the coin in the footer.' },
  { id: 'secret_about_coin', name: 'About Counter Tap', description: 'You clicked the coin icon in the About panel.' },
  { id: 'secret_index_coin', name: 'Index Header Tap', description: 'You clicked the coin icon in the Coin Index header.' },
];

const ALL_ACHIEVEMENTS = [...BASE_HIDDEN, ...MILESTONE_ACHIEVEMENTS, ...SECRET_ACHIEVEMENTS];


function getInitialAchievements() {
  const saved = localStorage.getItem('achievements');
  return saved ? JSON.parse(saved) : [];
}

function App() {
      const milestoneThresholds = MILESTONE_THRESHOLDS;
      const [milestone, setMilestone] = useState(null);
      const [showMilestoneGuide, setShowMilestoneGuide] = useState(false);
      const [deliveredMilestones, setDeliveredMilestones] = useState([]);
    const [showIntro, setShowIntro] = useState(() => {
      return !localStorage.getItem('raccoonish_intro_seen');
    });
  const [achievements, setAchievements] = useState(getInitialAchievements);
  const [buttonStates, setButtonStates] = useState(Array(9).fill(false));
  const [sequence, setSequence] = useState([]);

  const [speedrunActive, setSpeedrunActive] = useState(false);
  const [speedrunStart, setSpeedrunStart] = useState(null);
  const [speedrunElapsed, setSpeedrunElapsed] = useState(0);
  const [bestSpeedrun, setBestSpeedrun] = useState(() => {
    const v = localStorage.getItem('best_speedrun_ms');
    return v ? parseInt(v, 10) : null;
  });
  const speedrunTimerRef = useRef(null);
  const [showSpeedrunConfirm, setShowSpeedrunConfirm] = useState(false);
  const realMakerName = 'callmenixsh';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomChar = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomizeFrom = (s, revealCount = 0) => s.split('').map((ch, i) => i < revealCount ? ch : (/[a-zA-Z]/.test(ch) ? randomChar() : ch)).join('');
  const [scrambledName, setScrambledName] = useState(() => randomizeFrom(realMakerName, 0));
  const [revealedCount, setRevealedCount] = useState(0);
  const scrambleIntervalRef = useRef(null);
  const prevAchievementsRef = useRef(achievements.length);

  useEffect(() => {
    if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
    scrambleIntervalRef.current = setInterval(() => {
      setScrambledName(randomizeFrom(realMakerName, revealedCount));
    }, 50);
    return () => { if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current); };
  }, [revealedCount]);

  useEffect(() => {
    const prev = prevAchievementsRef.current || 0;
    const current = achievements.length;
    const newReveal = Math.min(Math.floor(current / 10), realMakerName.length);
    if (newReveal > revealedCount) {
      setRevealedCount(newReveal);
      setScrambledName(randomizeFrom(realMakerName, newReveal));
      setScrambledName(randomizeFrom(realMakerName, newReveal));
    }
    prevAchievementsRef.current = current;
  }, [achievements.length]);

  useEffect(() => {
    return () => { if (speedrunTimerRef.current) clearInterval(speedrunTimerRef.current); };
  }, []);

  const formatTime = (ms) => {
    if (ms == null) return '--:--.---';
    const total = Math.floor(ms);
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const millis = total % 1000;
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(millis).padStart(3,'0')}`;
  };

  const startSpeedrun = (requireConfirm = true) => {
    if (requireConfirm) {
      setShowSpeedrunConfirm(true);
      return;
    }
    resetAchievements();
    setDeliveredMilestones([]);
    setShowMilestoneGuide(false);
    setSpeedrunActive(true);
    const start = Date.now();
    setSpeedrunStart(start);
    setSpeedrunElapsed(0);
    if (speedrunTimerRef.current) clearInterval(speedrunTimerRef.current);
    speedrunTimerRef.current = setInterval(() => {
      setSpeedrunElapsed(Date.now() - start);
    }, 100);
  };

  const restartSpeedrun = () => {
    startSpeedrun(false);
  };

  const stopSpeedrun = (finished = false) => {
    if (speedrunTimerRef.current) {
      clearInterval(speedrunTimerRef.current);
      speedrunTimerRef.current = null;
    }
    setSpeedrunActive(false);
    if (finished) {
      const elapsed = speedrunElapsed || (Date.now() - speedrunStart);
      if (!bestSpeedrun || elapsed < bestSpeedrun) {
        setBestSpeedrun(elapsed);
        localStorage.setItem('best_speedrun_ms', String(elapsed));
        toast.success(
          <div className="flex items-center gap-2">
            <Coins className="text-amber-400" size={18} />
            <span className="font-semibold">New best time! {formatTime(elapsed)}</span>
          </div>
        );
      } else {
        toast.success(
          <div className="flex items-center gap-2">
            <Coins className="text-amber-400" size={18} />
            <span className="font-semibold">Run finished: {formatTime(elapsed)}</span>
          </div>
        );
      }
    }
    setSpeedrunStart(null);
    setSpeedrunElapsed(0);
  };

  const unlockAchievement = (id, { suppressMilestoneCheck = false } = {}) => {
    if (!achievements.includes(id)) {
      const updated = [...achievements, id];
      setAchievements(updated);
      localStorage.setItem('achievements', JSON.stringify(updated));

      if (!suppressMilestoneCheck) {
        const unlockedCount = updated.length;
        const nextMilestone = milestoneThresholds.find(m => m === unlockedCount);
        if (nextMilestone && !deliveredMilestones.includes(nextMilestone)) {
          if (speedrunActive) {
            
            setDeliveredMilestones([...deliveredMilestones, nextMilestone]);
            
            unlockAchievement(`milestone_${nextMilestone}`, { suppressMilestoneCheck: true });
          } else {
            setMilestone(nextMilestone);
            setShowMilestoneGuide(true);
            setDeliveredMilestones([...deliveredMilestones, nextMilestone]);
          }
        }
      }

      toast.success(
        <div className="flex items-center gap-2">
          <Coins className="text-amber-400" size={18} />
          <span className="font-semibold">Coin found!</span>
        </div>,
        {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          icon: false,
          progressClassName: 'bg-amber-400',
          progressStyle: { background: '#f59e0b' },
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-white border-amber-200 rounded-lg shadow-md',
          bodyClassName: 'p-2 text-slate-800',
        }
      );
      try { new Audio('/coinfound.wav').play(); } catch (e) {}
      if (speedrunActive && updated.length === ALL_ACHIEVEMENTS.length) {
        stopSpeedrun(true);
      }
    }
  };

  const leverCombos = [
    [0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6], [1,3,5,7], [0,2,6,8], [1,4,7], [0,1,3,4], [2,5,8],
    [0,4,7], [1,3,5], [2,4,8], [0,1,2,3,4], [5,6,7,8], [0,2,4,6,8], [1,3,5,7], [0,4,8], [2,4,6], [1,4,7],
    [0,1,3,4], [2,5,8], [0,4,7], [1,3,5], [2,4,8], [0,1,2,3,4], [5,6,7,8], [0,2,4,6,8], [1,3,5,7], [0,4,8],
    [2,4,6], [1,4,7], [0,1,3,4], [2,5,8], [0,4,7], [1,3,5], [2,4,8], [0,1,2,3,4], [5,6,7,8], [0,2,4,6,8],
    [1,3,5,7], [0,4,8], [2,4,6], [1,4,7], [0,1,3,4], [2,5,8], [0,4,7], [1,3,5], [2,4,8], [0,1,2,3,4,5,6,7,8]
  ];
  const uniqueComboMap = {};
  const uniqueCombos = [];
  for (let i = 0; i < leverCombos.length; i++) {
    const combo = leverCombos[i];
    const key = combo.slice().sort((a,b) => a-b).join(',');
    if (!uniqueComboMap[key]) {
      uniqueComboMap[key] = i + 1; // map to hidden_{i+1}
      uniqueCombos.push({ combo, achId: `hidden_${i+1}` });
    }
  }
  const handleLeverToggle = (idx) => {
    const newStates = [...buttonStates];
    newStates[idx] = !newStates[idx];
    setButtonStates(newStates);

    
    for (let i = 0; i < uniqueCombos.length; i++) {
      const { combo, achId } = uniqueCombos[i];
      const comboSet = new Set(combo);
      const comboActive = combo.every(j => newStates[j]);
      const othersOff = newStates.every((v, idx) => comboSet.has(idx) ? true : !v);
      if (comboActive && othersOff && !achievements.includes(achId)) {
        unlockAchievement(achId);
        break;
      }
    }
  };

  const [activeTab, setActiveTab] = useState(0);
  const resetAchievements = () => {
    setAchievements([]);
    localStorage.removeItem('achievements');
  };

  const tabData = [
    {
      label: 'Playground',
      icon: <Gamepad size={16} />, 
      content: (
        <>
          <div className="mb-6">
            <SecretButtons buttonStates={buttonStates} handleButtonClick={handleLeverToggle} />
            <EasterElements unlockAchievement={unlockAchievement} />
          </div>
        </>
      ),
    },
    {
      label: 'Coin Index',
      icon: <Coins size={16} />, 
      content: (
        <AchievementList achievements={ALL_ACHIEVEMENTS} unlocked={achievements} bestSpeedrun={bestSpeedrun} unlockAchievement={unlockAchievement} />
      ),
    },
    {
      label: 'About',
      icon: <Info size={16} />, 
      content: (
          <div className="w-full max-w-4xl mx-auto bg-white/90 dark:bg-gray-900 rounded-xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center dark:text-slate-200">
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="bg-amber-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
              <img src="/raccoonish.png" alt="Raccoonish" className="w-24 h-24 sm:w-28 sm:h-28 object-contain" />
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Welcome to Raccoonish</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">A playful page where your goal is to collect coins. No hints, just explore, experiment, and have fun.</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-slate-500">Coins Collected</div>
                <div className="text-xl font-bold text-slate-800 flex items-center gap-2 dark:text-white">
                  <Coins className="text-amber-400 cursor-pointer" size={18} onClick={() => unlockAchievement && unlockAchievement('secret_about_coin')} />
                  {achievements.length}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-slate-500">Unique Coins</div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">{ALL_ACHIEVEMENTS.length}</div>
              </div>
            </div>

            <ul className="mt-4 grid grid-cols-1 gap-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> Find secret buttons and elements</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> Unlock by discovering hidden combos</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> Try and speedrun all the coins</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> Progress saved locally in your browser</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> View your Coin Index to track progress</li>
            </ul>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button onClick={resetAchievements} className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg">Reset Coins</button>
                    <button onClick={() => setActiveTab(1)} className="px-4 py-2 border border-amber-300 text-amber-600 rounded-lg bg-white hover:bg-amber-50">Open Coin Index</button>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-white sm:text-left text-center">
              Made with <span className="text-amber-400">🪙</span> by {' '}
              {revealedCount < realMakerName.length ? (
                <span className="inline-block animate-pulse tracking-widest dark:text-white text-slate-800">{scrambledName}</span>
              ) : (
                <a href="https://github.com/callmenixsh" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">{realMakerName}</a>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex">
      {showIntro && (
        <BunnyIntro onFinish={() => {
          setShowIntro(false);
          localStorage.setItem('raccoonish_intro_seen', 'true');
        }} unlockAchievement={unlockAchievement} />
      )}
      {showMilestoneGuide && (
        <BunnyIntro
          milestone={milestone}
          onFinish={() => {
            setShowMilestoneGuide(false);
          }}
          unlockAchievement={unlockAchievement}
        />
      )}
      {showSpeedrunConfirm && (
        <BunnyIntro
          confirm
          onConfirm={() => {
            setShowSpeedrunConfirm(false);
            startSpeedrun(false);
          }}
          onCancel={() => setShowSpeedrunConfirm(false)}
        />
      )}
      <Sidebar
        tabs={tabData}
        active={activeTab}
        setActive={setActiveTab}
        speedrunActive={speedrunActive}
        speedrunElapsed={speedrunElapsed}
        bestSpeedrun={bestSpeedrun}
        startSpeedrun={() => startSpeedrun(true)}
        abortSpeedrun={() => stopSpeedrun(false)}
        restartSpeedrun={() => restartSpeedrun()}
        unlockAchievement={unlockAchievement}
      />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 md:ml-60 ml-0 pt-20 md:pt-12 dark:bg-gray-900">
        
        <div className="w-full max-w-3xl flex flex-col items-center mt-6 mb-8 dark:bg-gray-900 dark:text-slate-200 rounded-xl">
          
          {activeTab === 1 ? (
            <div className="flex flex-col items-center">
              <AchievementList achievements={ALL_ACHIEVEMENTS} unlocked={achievements} bestSpeedrun={bestSpeedrun} unlockAchievement={unlockAchievement} />
            </div>
          ) : tabData[activeTab].content}
        </div>
        <footer className="mt-auto py-8 text-xs text-gray-400 dark:text-gray-300 text-center w-full dark:bg-gray-900">
          <div className="mb-1">&copy; {new Date().getFullYear()} <span className="font-bold text-slate-700 dark:text-white">Raccoonish</span> &mdash; All rights reserved.</div>
          <div>
            <Coins className="inline-block text-amber-400 cursor-pointer" size={16} onClick={() => unlockAchievement && unlockAchievement('secret_footer_coin')} /> Collect coins and uncover secrets!
          </div>
        </footer>
          <div className="hidden sm:block">
            <ToastContainer
              position="top-right"
              limit={3}
              newestOnTop={true}
              toastClassName="bg-white dark:bg-black border-amber-200 rounded-lg shadow-md overflow-hidden"
              bodyClassName="p-2 text-slate-800"
              style={{ maxWidth: '360px', right: '1rem', zIndex: 99999 }}
            />
          </div>
      </main>
    </div>
  )

}

export default App
import React, { useState, useEffect } from 'react';

const introSteps = [
  {
    text: "Argh another one",
  },
  {
    text: "Welcome to Raccoonish! I'll be your guide.",
  },
  {
    text: "There are a lot of coins in random places, Try and find them all.",
  },
  {
    text: "To start try toggling the levers on the board to get started!",
  },
];

export default function BunnyIntro({ onFinish, milestone, unlockAchievement, confirm, onConfirm, onCancel }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);
  const [delivered, setDelivered] = useState(false);
  const coinIcons = {1: '🪙', 10: '🥇', 20: '⭐', 30: '🏅', 50: '👑', 100: '💎', 150: '✨', 200: '🎖️'};
  const coinFor = (m) => (m ? coinIcons[m] || '🪙' : '🪙');
  const SpecialButton = () => (
    !delivered && (
      <button
        className="w-14 h-14 rounded-full bg-amber-400 border-4 border-amber-600 shadow-lg flex items-center justify-center text-2xl text-white"
        onClick={() => {
          setDelivered(true);
          if (milestone) {
            if (unlockAchievement) unlockAchievement(`milestone_${milestone}`);
          } else {
            if (unlockAchievement) unlockAchievement('hidden_51');
          }
                  setVisible(false);
                  setTimeout(() => { if (onFinish) onFinish(); }, 300);
        }}
      >
        <span className="text-2xl">{coinFor(milestone)}</span>
      </button>
    )
  );

  const handleNext = () => {
        if (milestone) {
          setVisible(false);
          setTimeout(() => { if (onFinish) onFinish(); }, 300);
      return;
    }
    if (step < introSteps.length - 1) {
      setStep(step + 1);
        } else {
          setVisible(false);
          setTimeout(() => { if (onFinish) onFinish(); }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="pointer-events-auto fixed bottom-6 right-6 flex items-end">
            <div className={`flex items-center transition-all duration-300 translate-y-20 md:scale-120 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md -translate-y-20 translate-x-10">
            <div className="text-base font-medium text-slate-800">
              {confirm ? (
                'Starting a speedrun will reset your collected coins and progress. Milestone coins will be auto-collected during a speedrun. Ready to start?'
              ) : (milestone !== undefined && milestone !== null
                ? (milestone === 1
                    ? "Congrats on finding your first coin — here's a special one for your journey"
                    : `Congrats! You've got ${milestone} coins now. Here's a special coin for you!`)
                : introSteps[step].text)
              }
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              {confirm ? (
                <>
                  <button className="px-3 py-1 rounded-lg bg-gray-200 text-slate-700 text-sm" onClick={() => {
                    setVisible(false);
                    setTimeout(() => { if (onCancel) onCancel(); }, 250);
                  }}>Cancel</button>
                  <button className="px-3 py-1 rounded-lg bg-amber-400 text-white text-sm" onClick={() => {
                    setVisible(false);
                    setTimeout(() => { if (onConfirm) onConfirm(); }, 250);
                  }}>Start</button>
                </>
              ) : (milestone !== undefined && milestone !== null ? (
                <SpecialButton />
              ) : (
                <button className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-sm" onClick={handleNext}>
                  {step < introSteps.length - 1 ? 'Next' : 'Start'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src="/raccoon.png" alt="Raccoon Guide" className="w-100 h-140 mb-1 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
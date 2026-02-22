import { useState } from 'react';

export default function Tabs({ tabs, active, setActive }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex border-b border-slate-300 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`px-6 py-3 font-semibold transition border-b-4 rounded-t-lg ${active === i ? 'border-slate-500 text-slate-800 bg-slate-100 shadow' : 'border-transparent text-gray-500 hover:bg-slate-50'}`}
            onClick={() => setActive(i)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}{tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 min-h-[300px]">{tabs[active].content}</div>
    </div>
  );
}

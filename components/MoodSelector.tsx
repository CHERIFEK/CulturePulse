import React from 'react';
import { Smile, Frown, Meh, Angry, Laugh } from 'lucide-react';

interface MoodSelectorProps {
  value: number;
  onChange: (mood: number) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => {
  const moods = [
    { level: 1, icon: Angry, color: 'text-rose-500', label: 'Terrible' },
    { level: 2, icon: Frown, color: 'text-orange-500', label: 'Bad' },
    { level: 3, icon: Meh, color: 'text-yellow-500', label: 'Okay' },
    { level: 4, icon: Smile, color: 'text-lime-500', label: 'Good' },
    { level: 5, icon: Laugh, color: 'text-emerald-500', label: 'Great' },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-sm font-medium text-slate-700">Overall, how helpful was the training?</label>
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        {moods.map((m) => {
          const Icon = m.icon;
          const isSelected = value === m.level;
          
          return (
            <button
              key={m.level}
              type="button"
              onClick={() => onChange(m.level)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 group focus:outline-none ${isSelected ? 'scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
            >
              <div className={`p-3 rounded-full transition-colors ${isSelected ? 'bg-slate-100 ring-2 ring-offset-2 ring-brand-200' : 'hover:bg-slate-50'}`}>
                <Icon 
                  size={32} 
                  className={`${isSelected ? m.color : 'text-slate-400'} transition-colors`} 
                  strokeWidth={isSelected ? 2.5 : 2}
                />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
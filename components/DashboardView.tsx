import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Wand2, Loader2, Quote, TrendingUp, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Submission, ActionPlanResponse } from '../types';
import { generateActionPlan } from '../services/geminiService';

interface DashboardViewProps {
  submissions: Submission[];
  onBack: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ submissions, onBack }) => {
  const [actionPlan, setActionPlan] = useState<ActionPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const averageMood = useMemo(() => {
    if (submissions.length === 0) return 0;
    const sum = submissions.reduce((acc, curr) => acc + curr.mood, 0);
    return (sum / submissions.length).toFixed(1);
  }, [submissions]);

  const chartData = useMemo(() => {
    const data = [
      { mood: '1', count: 0, label: 'Terrible' },
      { mood: '2', count: 0, label: 'Bad' },
      { mood: '3', count: 0, label: 'Okay' },
      { mood: '4', count: 0, label: 'Good' },
      { mood: '5', count: 0, label: 'Great' },
    ];
    submissions.forEach(s => {
      if (s.mood >= 1 && s.mood <= 5) {
        data[s.mood - 1].count += 1;
      }
    });
    return data;
  }, [submissions]);

  const handleGenerateActionPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateActionPlan(submissions);
      setActionPlan(plan);
    } catch (err) {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const barColors = ['#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981'];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-8 pb-24">
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Mood</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-bold text-slate-800">{averageMood}</span>
            <span className="text-sm text-slate-400 mb-1">/ 5.0</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Responses</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-bold text-slate-800">{submissions.length}</span>
            <span className="text-sm text-slate-400 mb-1">total</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-brand-500" size={20} />
          <h3 className="font-bold text-slate-800">Mood Distribution</h3>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="mood" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Magic Action Plan Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-1 rounded-3xl shadow-sm border border-indigo-100">
        <div className="bg-white/60 backdrop-blur-xl rounded-[20px] p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                <Wand2 className="text-indigo-500" size={20} />
                AI Insights
              </h3>
              <p className="text-sm text-indigo-600/80 mt-1">Generate a management plan from current feedback.</p>
            </div>
          </div>

          {!actionPlan && !isLoading && (
            <button 
              onClick={handleGenerateActionPlan}
              disabled={submissions.length === 0}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 size={16} />
              Generate Action Plan
            </button>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-indigo-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm font-medium animate-pulse">Analyzing team sentiment...</span>
            </div>
          )}

          {error && (
             <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-50 p-3 rounded-xl mt-4">
               <AlertCircle size={16} />
               {error}
             </div>
          )}

          {actionPlan && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-indigo-100/50 p-4 rounded-xl text-indigo-900 text-sm font-medium leading-relaxed border border-indigo-100">
                "{actionPlan.summary}"
              </div>
              
              <div className="space-y-3">
                {actionPlan.points.map((point, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
                    <div className="bg-indigo-100 text-indigo-600 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-sm">{point}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleGenerateActionPlan}
                className="w-full mt-4 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-600 transition-colors"
              >
                Refresh Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 px-2">Recent Voices</h3>
        {submissions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            No feedback yet. Be the first!
          </div>
        ) : (
          submissions.slice().reverse().map((sub) => (
            <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                 <div className={`
                    px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide
                    ${sub.mood <= 2 ? 'bg-rose-50 text-rose-600' : 
                      sub.mood === 3 ? 'bg-yellow-50 text-yellow-600' : 
                      'bg-emerald-50 text-emerald-600'}
                 `}>
                   Mood: {sub.mood}/5
                 </div>
                 <span className="text-[10px] text-slate-300">
                   {new Date(sub.timestamp).toLocaleDateString()}
                 </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {sub.feedback}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer Navigation */}
      <div className="text-center mt-12 mb-6">
         <button 
           onClick={onBack}
           className="text-xs text-slate-400 hover:text-brand-500 transition-colors flex items-center justify-center gap-1 mx-auto"
         >
           <Sparkles size={12} />
           <span>Powered by Central Innovation Team</span>
         </button>
      </div>

    </div>
  );
};

export default DashboardView;
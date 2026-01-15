import React, { useState, useEffect } from 'react';
import SubmitView from './components/SubmitView';
import DashboardView from './components/DashboardView';
import { Submission, AppView } from './types';
import { PlusCircle, LayoutDashboard, RefreshCcw } from 'lucide-react';
import { fetchSubmissions, postSubmission, GOOGLE_SCRIPT_URL } from './services/sheetService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SUBMIT);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    setIsLoading(true);
    const data = await fetchSubmissions();
    if (data) {
        // Sort by timestamp descending
        setSubmissions(data.sort((a, b) => b.timestamp - a.timestamp));
    }
    setIsLoading(false);
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const handleSubmission = async (newSubmission: Submission) => {
    // 1. Optimistic update (show it immediately)
    setSubmissions(prev => [newSubmission, ...prev]);
    
    // 2. Send to Google Sheets
    await postSubmission(newSubmission);
    
    // 3. Switch view
    setView(AppView.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-200">
                CP
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600">
                CulturePulse
            </h1>
        </div>
        {view === AppView.DASHBOARD && GOOGLE_SCRIPT_URL && (
            <button 
                onClick={loadData} 
                className={`p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-all ${isLoading ? 'animate-spin' : ''}`}
            >
                <RefreshCcw size={18} />
            </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pb-20">
        <div className="transition-opacity duration-300 ease-in-out">
            {view === AppView.SUBMIT ? (
                <SubmitView onSubmit={handleSubmission} />
            ) : (
                <DashboardView submissions={submissions} />
            )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/50 rounded-full p-1.5 flex gap-1 z-50 ring-1 ring-slate-100">
        <button
          onClick={() => setView(AppView.SUBMIT)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300
            ${view === AppView.SUBMIT 
                ? 'bg-brand-500 text-white shadow-md shadow-brand-200 scale-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
          `}
        >
          <PlusCircle size={18} />
          <span>Survey</span>
        </button>
        <button
          onClick={() => setView(AppView.DASHBOARD)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300
            ${view === AppView.DASHBOARD 
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200 scale-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
          `}
        >
          <LayoutDashboard size={18} />
          <span>Results</span>
        </button>
      </nav>

    </div>
  );
};

export default App;

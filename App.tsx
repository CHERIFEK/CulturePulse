import React, { useState, useEffect } from 'react';
import SubmitView from './components/SubmitView';
import DashboardView from './components/DashboardView';
import { Submission, AppView } from './types';
import { RefreshCcw, Home } from 'lucide-react';
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
    // 1. Optimistic update (for when we view dashboard later)
    setSubmissions(prev => [newSubmission, ...prev]);
    
    // 2. Send to Google Sheets
    await postSubmission(newSubmission);
    
    // 3. Do NOT switch view, the child component handles the success state
  };

  const switchToDashboard = () => {
    setView(AppView.DASHBOARD);
    loadData(); // Ensure we have the latest data
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-200">
                AI
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600">
                AI Feedback
            </h1>
        </div>
        
        {/* Only show controls if in Dashboard view */}
        {view === AppView.DASHBOARD && (
            <div className="flex items-center gap-2">
                {GOOGLE_SCRIPT_URL && (
                    <button 
                        onClick={loadData} 
                        className={`p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-all ${isLoading ? 'animate-spin' : ''}`}
                        title="Refresh Data"
                    >
                        <RefreshCcw size={18} />
                    </button>
                )}
                <button
                    onClick={() => setView(AppView.SUBMIT)}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-all"
                    title="Back to Survey"
                >
                    <Home size={18} />
                </button>
            </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pb-10">
        <div className="transition-opacity duration-300 ease-in-out">
            {view === AppView.SUBMIT ? (
                <SubmitView onSubmit={handleSubmission} onSecretDashboardAccess={switchToDashboard} />
            ) : (
                <DashboardView submissions={submissions} onBack={() => setView(AppView.SUBMIT)} />
            )}
        </div>
      </main>

      {/* Bottom Navigation Removed for Secret Access Mode */}

    </div>
  );
};

export default App;
import React, { useState } from 'react';
import MoodSelector from './MoodSelector';
import { Send, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { Submission } from '../types';
import { GOOGLE_SCRIPT_URL } from '../services/sheetService';

interface SubmitViewProps {
  onSubmit: (submission: Submission) => Promise<void>;
  onSecretDashboardAccess: () => void;
}

const SubmitView: React.FC<SubmitViewProps> = ({ onSubmit, onSecretDashboardAccess }) => {
  const [mood, setMood] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsAnimating(true);
    
    const newSubmission: Submission = {
      id: crypto.randomUUID(),
      mood,
      feedback: feedback.trim(),
      timestamp: Date.now(),
    };

    await onSubmit(newSubmission);
    
    // Show success message instead of redirecting
    setIsAnimating(false);
    setShowSuccess(true);
    
    // Reset form state behind the scenes
    setMood(3);
    setFeedback('');
  };

  if (showSuccess) {
    return (
        <div className="max-w-md mx-auto w-full px-4 py-12 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Thank You!</h2>
            <p className="text-slate-500 max-w-xs leading-relaxed">Your feedback is incredibly valuable and helps us improve our AI training sessions.</p>
            
            <button 
                onClick={() => setShowSuccess(false)}
                className="mt-6 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold shadow-lg shadow-brand-200 transition-all active:scale-95"
            >
                Submit Another Response
            </button>

            <div className="mt-12">
               <button 
                 onClick={onSecretDashboardAccess}
                 className="text-xs text-slate-300 hover:text-slate-400 flex items-center justify-center gap-1 transition-colors"
               >
                 <Sparkles size={12} />
                 <span>Powered by Central Innovation Team</span>
               </button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-6">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl font-bold text-slate-800">AI Course Feedback</h2>
        <p className="text-slate-500">How was your recent AI training experience?</p>
      </div>
      
      {!GOOGLE_SCRIPT_URL && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm flex gap-2 items-start">
           <AlertTriangle className="shrink-0 mt-0.5" size={16} />
           <p>
             <strong>Configuration Needed:</strong> Please add your Google Apps Script Web App URL to <code>services/sheetService.ts</code> to enable data saving.
           </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <MoodSelector value={mood} onChange={setMood} />

        <div className="flex flex-col gap-2">
          <label htmlFor="feedback" className="text-sm font-medium text-slate-700">
             Comments
          </label>
          <textarea
            id="feedback"
            rows={4}
            className="w-full p-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400 bg-white"
            placeholder="What were your main takeaways or suggestions?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!feedback.trim() || isAnimating}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-brand-200 flex items-center justify-center gap-2 transition-all transform active:scale-95
            ${!feedback.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-600 hover:shadow-brand-300'}`}
        >
          {isAnimating ? (
            <Sparkles className="animate-spin" size={20} />
          ) : (
            <>
              <span>Submit Feedback</span>
              <Send size={18} />
            </>
          )}
        </button>
      </form>
      
      <div className="text-center">
         <button 
           type="button"
           onClick={onSecretDashboardAccess}
           className="text-xs text-slate-400 hover:text-brand-500 transition-colors flex items-center justify-center gap-1 mx-auto"
         >
           <Sparkles size={12} />
           <span>Powered by Central Innovation Team</span>
         </button>
      </div>
    </div>
  );
};

export default SubmitView;
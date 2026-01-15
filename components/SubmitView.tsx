import React, { useState } from 'react';
import MoodSelector from './MoodSelector';
import { Send, Sparkles, AlertTriangle } from 'lucide-react';
import { Submission } from '../types';
import { GOOGLE_SCRIPT_URL } from '../services/sheetService';

interface SubmitViewProps {
  onSubmit: (submission: Submission) => Promise<void>;
}

const SubmitView: React.FC<SubmitViewProps> = ({ onSubmit }) => {
  const [mood, setMood] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

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
    
    // Reset form
    setMood(3);
    setFeedback('');
    setIsAnimating(false);
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-6">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Weekly Pulse Check</h2>
        <p className="text-slate-500">Your feedback is anonymous and helps us improve.</p>
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
            What's on your mind?
          </label>
          <textarea
            id="feedback"
            rows={4}
            className="w-full p-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400 bg-white"
            placeholder="Share your thoughts on projects, team vibes, or office snacks..."
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
         <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
           <Sparkles size={12} />
           <span>Powered by CulturePulse AI</span>
         </p>
      </div>
    </div>
  );
};

export default SubmitView;

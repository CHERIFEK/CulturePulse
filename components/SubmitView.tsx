import React, { useState } from 'react';
import MoodSelector from './MoodSelector';
import { Send, Sparkles } from 'lucide-react';
import { Submission } from '../types';

interface SubmitViewProps {
  onSubmit: (submission: Submission) => void;
}

const SubmitView: React.FC<SubmitViewProps> = ({ onSubmit }) => {
  const [mood, setMood] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsAnimating(true);
    
    // Simulate a small network delay for UX
    setTimeout(() => {
      const newSubmission: Submission = {
        id: crypto.randomUUID(),
        mood,
        feedback: feedback.trim(),
        timestamp: Date.now(),
      };
      onSubmit(newSubmission);
      // Reset form handled by parent switching view, but we can reset state here too
      setMood(3);
      setFeedback('');
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-6">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Weekly Pulse Check</h2>
        <p className="text-slate-500">Your feedback is anonymous and helps us improve.</p>
      </div>

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

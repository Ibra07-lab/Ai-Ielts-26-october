import { useState } from 'react';
import ReadingTutorChat from '@/components/chat/ReadingTutorChat';
import { MessageSquare } from 'lucide-react';

export default function ReadingTutorChatPage() {
  const [droppedQuestionId, setDroppedQuestionId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10 h-[calc(100vh-4rem)] flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              AI Reading Mentor
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Your personal guide to mastering IELTS Reading
            </p>
          </div>

          {/* Quick Stats or Status could go here */}
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 min-h-0">
          <ReadingTutorChat droppedQuestionId={droppedQuestionId} />
        </div>

        {/* Footer / Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Instant feedback on answers
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Strategy explanations
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            24/7 Practice partner
          </div>
        </div>
      </div>
    </div>
  );
}


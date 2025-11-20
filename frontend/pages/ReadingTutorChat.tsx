import { useState } from 'react';
import ReadingTutorChat from '@/components/chat/ReadingTutorChat';
import { MessageSquare } from 'lucide-react';

export default function ReadingTutorChatPage() {
  const [droppedQuestionId, setDroppedQuestionId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          AI Reading Tutor
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Get personalized help with IELTS Reading questions and strategies
        </p>
      </div>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-220px)] min-h-[700px]">
        <ReadingTutorChat droppedQuestionId={droppedQuestionId} />
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">How to use the tutor:</h3>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
          <li>• Ask questions about IELTS Reading strategies and techniques</li>
          <li>• Request explanations for why certain answers are correct or incorrect</li>
          <li>• Ask for hints if you're stuck on a question</li>
          <li>• Discuss time management and question-type specific approaches</li>
          <li>• Get motivational support and study tips</li>
        </ul>
      </div>
    </div>
  );
}


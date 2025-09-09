import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MathJax } from 'better-react-mathjax';

export function AiExplanationDialog({ isOpen, onClose, question, userAnswer }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detailed Explanation</DialogTitle>
          <DialogDescription>
            Understanding the solution step by step
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Question */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Question:</h4>
            <MathJax className="text-gray-200">
              {String(question?.question ?? '')}
            </MathJax>
          </div>

          {/* Your Answer */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Your Answer:</h4>
            <div className={`p-3 rounded-lg ${userAnswer === question?.answer ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <MathJax className={userAnswer === question?.answer ? 'text-green-500' : 'text-red-500'}>
                {String(question?.options[userAnswer] ?? '')}
              </MathJax>
            </div>
          </div>

          {/* Correct Answer (if wrong) */}
          {userAnswer !== question?.answer && (
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Correct Answer:</h4>
              <div className="p-3 rounded-lg bg-green-500/10">
                <MathJax className="text-green-500">
                  {String(question?.options[question?.answer] ?? '')}
                </MathJax>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Explanation:</h4>
            <div className="p-4 rounded-lg bg-gray-800/50">
              <MathJax className="text-gray-300">
                {String(question?.explanation ?? '')}
              </MathJax>
            </div>
          </div>

          {/* Additional Tips */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Review the concept thoroughly</li>
              <li>Practice similar problems</li>
              <li>Focus on understanding rather than memorizing</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

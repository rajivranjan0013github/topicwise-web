import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateStats } from '@/lib/utils';

const ResultsDialog = ({
  isOpen,
  onClose,
  questions,
  onMarkAsCompleted,
}) => {
  // Calculate stats using utility function
  const stats = useMemo(() => calculateStats(questions), [questions]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            Progress Summary
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <Card className="mb-8 bg-secondary/30 border-primary">
          <CardContent className="grid grid-cols-4 gap-4 py-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary mb-1">
                {stats.totalQuestions}
              </span>
              <span className="text-muted-foreground text-xs">Total</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary mb-1">
                {stats.attemptedQuestions}
              </span>
              <span className="text-muted-foreground text-xs">Attempted</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary mb-1">
                {stats.score}
              </span>
              <span className="text-muted-foreground text-xs">Correct</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-red-500 mb-1">
                {stats.incorrectCount}
              </span>
              <span className="text-muted-foreground text-xs">Incorrect</span>
            </div>
          </CardContent>
        </Card>

        {/* Result Message */}
        <Card className="mb-8 bg-secondary/30 border-primary">
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground mb-2">
              You've answered {stats.score} out of {stats.attemptedQuestions}{' '}
              attempted questions correctly
              {stats.attemptedQuestions < stats.totalQuestions &&
                ` (${stats.totalQuestions - stats.attemptedQuestions} questions remaining)`}
            </p>
            <p
              className={`text-xl font-bold text-center ${
                stats.isExcellent 
                  ? 'text-green-500' 
                  : stats.isGood 
                    ? 'text-yellow-500' 
                    : 'text-red-500'
              }`}
            >
              {stats.isExcellent
                ? 'Excellent Progress! 🎉'
                : stats.isGood
                  ? 'Good Progress! 👍'
                  : 'Keep Learning! 💪'}
            </p>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full border-primary bg-background/90 hover:bg-primary hover:text-primary-foreground"
          onClick={onMarkAsCompleted}
        >
          Mark as Completed
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;

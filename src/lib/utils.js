import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function calculateStats(questions) {
  const totalQuestions = questions?.length || 0;
  const attemptedQuestions = questions?.filter(q => q.userAnswer !== undefined).length || 0;
  const score = questions?.filter(q => q.userAnswer === q.answer).length || 0;
  const incorrectCount = attemptedQuestions - score;
  
  // Calculate performance indicators
  const percentage = attemptedQuestions > 0 ? (score / attemptedQuestions) * 100 : 0;
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60 && percentage < 80;

  return {
    totalQuestions,
    attemptedQuestions,
    score,
    incorrectCount,
    isExcellent,
    isGood,
  };
}
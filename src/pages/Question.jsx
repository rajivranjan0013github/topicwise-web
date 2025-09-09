import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LightbulbIcon } from 'lucide-react';
import { MathJax } from 'better-react-mathjax';
import Logo from '@/components/Logo';
import ResultsDialog from '@/components/ResultsDialog';
import AiExplanationDialog from '@/components/AiExplanationDialog';

const APP_URL = 'http://10.37.161.152:3002/api/question';

function QuestionCard({ question, questionIndex, isAnswered, isCorrect, userAnswer, onOptionSelect }) {
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [internalUserAnswer, setInternalUserAnswer] = useState(userAnswer);

  // Sync internal state with prop
  useEffect(() => {
    setInternalUserAnswer(userAnswer);
  }, [userAnswer]);

  // Don't render anything if we don't have valid question data
  if (!question || !Array.isArray(question.options)) {
    return null;
  }

  // Memoize the option click handler
  const handleOptionClick = useMemo(() => {
    return (optionIndex) => {
      if (!isAnswered) {
        setInternalUserAnswer(optionIndex); // Immediate visual update
        onOptionSelect(question._id, optionIndex); // Propagate to parent
      }
    };
  }, [isAnswered, onOptionSelect, question?._id]);

  // Memoize options rendering
  const optionsContent = useMemo(() => {
    if (!question?.options) return null;

    return question.options.map((option, optionIndex) => {
      const isUserAnswer = internalUserAnswer === optionIndex;
      const isCorrectAnswer = question.answer === optionIndex;
      
      // Calculate styles
      let bgColor = 'bg-card';
      let borderColor = 'border-border';
      let optionTextColor = 'text-gray-200';

      if (isAnswered) {
        if (isCorrectAnswer) {
          bgColor = 'bg-green-500/10';
          borderColor = 'border-green-500';
          optionTextColor = 'text-green-500';
        } else if (isUserAnswer) {
          bgColor = 'bg-red-500/10';
          borderColor = 'border-red-500';
          optionTextColor = 'text-red-500';
        }
      }

      return (
        <button
          key={optionIndex}
          onClick={() => handleOptionClick(optionIndex)}
          disabled={isAnswered}
          className={`w-full text-left ${isAnswered ? 'cursor-default' : 'hover:bg-gray-700/50 transition-colors duration-200'}`}
        >
          <div className={`relative p-4 rounded-xl border-2 flex items-center ${bgColor} ${borderColor}`}>
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-4">
              <span className="text-sm font-bold text-muted-foreground">
                {String.fromCharCode(65 + optionIndex)}
              </span>
            </div>
            <div className="flex-1">
              <MathJax className={optionTextColor}>
                {String(option ?? '')}
              </MathJax>
            </div>
            {isAnswered && (isUserAnswer || isCorrectAnswer) && (
              <Badge variant="secondary" className="absolute -right-2 -top-2">
                <span className="text-[10px]">
                  {isUserAnswer ? 'Your Answer' : 'Correct Answer'}
                </span>
              </Badge>
            )}
          </div>
        </button>
      );
    });
  }, [question?.options, question?.answer, internalUserAnswer, isAnswered, handleOptionClick]);

  // Memoize explanation content
  const explanationContent = useMemo(() => {
    if (!isAnswered) return null;

    return (
      <>
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-primary">
              Explanation:
            </span>
            <button
              onClick={() => setShowAiExplanation(true)}
              className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20"
            >
              <LightbulbIcon className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm">More Details</span>
            </button>
          </div>
          <div className="mt-1">
            <MathJax className="text-gray-400 text-sm">
              {String(question?.explanation ?? '')}
            </MathJax>
          </div>
        </div>

        {showAiExplanation && (
          <AiExplanationDialog
            isOpen={showAiExplanation}
            onClose={() => setShowAiExplanation(false)}
            question={question}
            userAnswer={userAnswer}
          />
        )}
      </>
    );
  }, [isAnswered, question?.explanation, showAiExplanation, userAnswer]);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between">
          <span className="text-primary text-sm font-semibold uppercase tracking-wide opacity-70">
            Question {questionIndex + 1}
          </span>
          {isAnswered && (
            <Badge
              variant={isCorrect ? 'success' : 'destructive'}
              className="rounded-full px-2 py-1"
            >
              {isCorrect ? 'Correct' : 'Incorrect'}
            </Badge>
          )}
        </div>
        <div className="mt-1">
          <MathJax>
            {String(question?.question ?? '')}
          </MathJax>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {optionsContent}
          {explanationContent}
        </div>
      </CardContent>
    </Card>
  );

  return questionContent;
}

export default function RedirectQuestion() {
  const { id } = useParams();
  const [questionSet, setQuestionSet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Refs for tracking state
  const userAnswersRef = useRef(userAnswers);
  const hasChangesRef = useRef(false);

  // Transform questions data for results
  const questionsWithAnswers = questionSet?.questions?.map(q => ({
    ...q,
    userAnswer: userAnswers[q._id]
  })) || [];

  // Auto-save functionality
  useEffect(() => {
    userAnswersRef.current = userAnswers;
    if (hasChanges) {
      const saveTimeout = setTimeout(() => {
        console.log('Auto-saving answers...', userAnswers);
        // TODO: Implement API call to save answers
        setHasChanges(false);
      }, 2000);

      return () => clearTimeout(saveTimeout);
    }
  }, [userAnswers, hasChanges]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (hasChangesRef.current) {
        console.log('Saving answers on unmount...', userAnswersRef.current);
        // TODO: Implement API call to save answers
      }
    };
  }, []);

    useEffect(() => {
      
    // Note: In development, this effect will run twice due to React.StrictMode
    // This is intentional and helps catch certain types of bugs
    let isMounted = true;

    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const dataUrl = `${APP_URL}/${id}`;
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw API response:', data);
        
        // Validate the data structure
        if (!data || !Array.isArray(data.questions)) {
          throw new Error('Invalid question set data format');
        }
        
        // Only update state if component is still mounted
        if (isMounted) {
          setQuestionSet(data);
          console.log('Question set data:', data);
        }
      } catch (err) {
        // Only update state if component is still mounted
        if (isMounted) {
          setError(err.message || 'Failed to fetch question data');
          console.error('Error fetching question:', err);
        }
      } finally {
        // Only update state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestion();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isMounted = false;
    };
  }, [id]);


  const handleOptionSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: optionIndex
      };
      hasChangesRef.current = true;
      setHasChanges(true);
      return newAnswers;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/5">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <Link to="/" className="flex items-center gap-4 w-fit group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-2xl blur-xl group-hover:animate-pulse"></div>
              <img 
                src="/src/assets/app-icon.png" 
                alt="TopicWise Logo" 
                className="w-8 h-8 object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
            <Logo className="h-8 w-auto text-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto p-4">
        {isLoading && (
          <div className="text-foreground text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading questions...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive-foreground text-center">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && questionSet && (
          <>
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 p-4 rounded-lg mb-6 border">
              <div className="flex justify-between items-center text-foreground">
                <span className="text-xl font-semibold">Topic: {questionSet.topic}</span>
                <span>
                  Answered: {Object.keys(userAnswers).length} / {questionSet.questions?.length}
                </span>
              </div>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ 
                    width: `${(Object.keys(userAnswers).length / (questionSet.questions?.length || 1)) * 100}%` 
                  }}
            />
          </div>
        </div>

            <div className="space-y-8">
              {questionSet.questions?.map((question, index) => {
                const isAnswered = userAnswers.hasOwnProperty(question._id);
                const userAnswer = userAnswers[question._id];
                
                return (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    questionIndex={index}
                    isAnswered={isAnswered}
                    isCorrect={isAnswered && userAnswer === question.answer}
                    userAnswer={userAnswer}
                    onOptionSelect={handleOptionSelect}
                  />
                );
              })}
        </div>

            <div className="sticky bottom-4 mt-8 bg-background/95 backdrop-blur-sm p-4 rounded-lg border">
              <div className="flex justify-between items-center gap-4">
                <span className="text-foreground">
                  Correct: {Object.entries(userAnswers).filter(([id, answer]) => 
                    questionSet.questions.find(q => q._id === id)?.answer === answer
                  ).length} / {Object.keys(userAnswers).length}
                </span>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowResults(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                  >
                    Show Results
                  </button>
          <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg"
          >
                    Back to Top
          </button>
        </div>
              </div>
        </div>

            {/* Results Dialog */}
            <ResultsDialog
              isOpen={showResults}
              onClose={() => setShowResults(false)}
              questions={questionsWithAnswers}
              onMarkAsCompleted={() => {
                // Handle marking as completed
                setShowResults(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
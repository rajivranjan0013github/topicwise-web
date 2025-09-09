import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Section headers used in AI markdown output
const SECTION_HEADERS = {
  CorrectAnswer: '### ✅ The Correct Answer Explained',
  OtherOptions: '### 📚 Understanding the Other Options',
  RelatedFacts: '### 💡 Related Facts',
  MemoryTechnique: '### 🧠 Memory Technique',
};

// Extract a section from markdown text by header marker
const extractSection = (text, sectionKey) => {
  if (!text || !sectionKey) return '';

  const startMarker = SECTION_HEADERS[sectionKey];
  if (!startMarker) return '';

  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return '';

  const contentStartIndex = startIndex + startMarker.length;

  let endIndex = text.length;
  const allMarkers = Object.values(SECTION_HEADERS);
  for (const marker of allMarkers) {
    if (marker === startMarker) continue;
    const nextMarkerIndex = text.indexOf(marker, contentStartIndex);
    if (nextMarkerIndex !== -1 && nextMarkerIndex < endIndex) {
      endIndex = nextMarkerIndex;
    }
  }

  return text.slice(contentStartIndex, endIndex).trim();
};

export function AiExplanationDialog({ isOpen, onClose, question, userAnswer, fetchAiExplanation, aiEndpoint, authToken }) {
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resolvedEndpoint = useMemo(() => {
    if (aiEndpoint) return aiEndpoint;
    if (import.meta?.env?.VITE_AI_EXPLANATION_URL) return import.meta.env.VITE_AI_EXPLANATION_URL;
    if (import.meta?.env?.VITE_API_URL) return `${import.meta.env.VITE_API_URL}/api/topic/explain-question`;
    return 'https://app.thebilling.in/api/topic/explain-question';
  }, [aiEndpoint]);

  const resolvedToken = useMemo(() => {
    if (authToken) return authToken;
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('jwt');
      }
    } catch {}
    return null;
  }, [authToken]);

  useEffect(() => {
    let isCancelled = false;
    const loadExplanation = async () => {
      if (!isOpen) return;
      setError(null);
      setIsLoading(true);

      try {
        let explanation = '';
        if (typeof fetchAiExplanation === 'function') {
          // Custom fetch function provided by parent
          explanation = await fetchAiExplanation({ question, userAnswer });
        } else if (resolvedEndpoint) {
          // Default POST to configured endpoint
          const headers = { 'Content-Type': 'application/json' };

          const response = await fetch(resolvedEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              question: question?.question,
              options: question?.options,
              correctAnswer: question?.answer,
              userAnswer,
              originalExplanation: question?.explanation,
            }),
          });

          const contentType = response.headers.get('content-type') || '';
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          if (contentType.includes('application/json')) {
            const data = await response.json();
            explanation = data?.explanation || data?.data?.explanation || '';
          } else {
            explanation = await response.text();
          }
        }

        // Fallbacks
        if (!explanation) {
          explanation = String(question?.aiExplanation ?? question?.explanation ?? '');
        }

        if (!isCancelled) {
          setAiExplanation(explanation);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err?.message || 'Failed to fetch explanation');
          setAiExplanation(String(question?.aiExplanation ?? question?.explanation ?? ''));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadExplanation();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, resolvedEndpoint, fetchAiExplanation, question, userAnswer]);

  const explanationText = useMemo(() => String(aiExplanation || question?.aiExplanation || question?.explanation || ''), [aiExplanation, question]);

  // Extract structured sections if present
  const correctAnswerContent = extractSection(explanationText, 'CorrectAnswer');
  const otherOptionsContent = extractSection(explanationText, 'OtherOptions');
  const relatedFactsContent = extractSection(explanationText, 'RelatedFacts');
  const memoryTechniqueContent = extractSection(explanationText, 'MemoryTechnique');

  const hasStructuredSections = useMemo(() => ([
    correctAnswerContent,
    otherOptionsContent,
    relatedFactsContent,
    memoryTechniqueContent,
  ].some(Boolean)), [correctAnswerContent, otherOptionsContent, relatedFactsContent, memoryTechniqueContent]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 py-3 border-b border-border">
          <DialogTitle className="text-base">Detailed Explanation</DialogTitle>
          <DialogDescription className="text-xs">Understanding the solution step by step</DialogDescription>
        </DialogHeader>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Question */}
          <div className="space-y-2">
            <h4 className="font-medium text-primary text-sm">Question:</h4>
            <MathJax className="text-gray-200">
              {String(question?.question ?? '')}
            </MathJax>
          </div>

          {/* Your Answer */}
         

          {/* Loading / Error states for AI explanation */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
              <p className="mt-3 text-xs text-muted-foreground">Getting detailed explanation...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="text-center text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Correct Answer (if wrong) */}
        

          {/* Structured sections from AI markdown if available */}
          {!isLoading && !error && hasStructuredSections ? (
            <div className="space-y-3">
              {correctAnswerContent && (
                <div className="border border-border rounded-lg">
                  <div className="text-primary font-semibold text-xs px-3 py-2">
                    ✅ The Correct Answer Explained
                  </div>
                  <div className="border-t border-border px-3 py-2 prose prose-invert max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {correctAnswerContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {otherOptionsContent && (
                <div className="border border-border rounded-lg">
                  <div className="text-primary font-semibold text-xs px-3 py-2">
                    📚 Understanding the Other Options
                  </div>
                  <div className="border-t border-border px-3 py-2 prose prose-invert max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {otherOptionsContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {relatedFactsContent && (
                <div className="border border-border rounded-lg">
                  <div className="text-primary font-semibold text-xs px-3 py-2">
                    💡 Related Facts
                  </div>
                  <div className="border-t border-border px-3 py-2 prose prose-invert max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {relatedFactsContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {memoryTechniqueContent && (
                <div className="border border-border rounded-lg">
                  <div className="text-primary font-semibold text-xs px-3 py-2">
                    🧠 Memory Technique
                  </div>
                  <div className="border-t border-border px-3 py-2 prose prose-invert max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {memoryTechniqueContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Fallback to a single explanation block if no structured sections
            !isLoading && !error && (
              <div className="space-y-2">
                <h4 className="font-medium text-primary text-sm">Explanation:</h4>
                <div className="p-4 rounded-lg bg-gray-800/50 prose prose-invert max-w-none text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {explanationText || 'No detailed explanation is available.'}
                  </ReactMarkdown>
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

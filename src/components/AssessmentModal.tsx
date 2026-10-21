import React, { useState, useEffect } from 'react';
import { Question, PlacementArea, Attempt, AttemptDetail } from '../types';
import { INITIAL_QUESTION_BANK, PLACEMENT_AREAS } from '../data/questionBank';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  RotateCcw,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';

interface AssessmentModalProps {
  area?: PlacementArea;
  topic?: string;
  isDiagnostic?: boolean;
  onClose: () => void;
  onComplete: (attempt: Attempt) => void;
  userId: string;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  area,
  topic,
  isDiagnostic = false,
  onClose,
  onComplete,
  userId,
}) => {
  // Select questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<Attempt | null>(null);

  // AI Hint & Explanation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  useEffect(() => {
    let pool: Question[] = [];
    if (isDiagnostic) {
      // Pick 1-2 representative questions from each of the 6 areas
      const areas: PlacementArea[] = ['aptitude', 'dsa', 'core_cs', 'tech_interview', 'hr_interview', 'resume'];
      areas.forEach((a) => {
        const areaQ = INITIAL_QUESTION_BANK.filter(q => q.area === a);
        pool.push(...areaQ.slice(0, 2));
      });
    } else if (area) {
      pool = INITIAL_QUESTION_BANK.filter(q => q.area === area);
      if (topic) {
        const topicFiltered = pool.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
        if (topicFiltered.length > 0) pool = topicFiltered;
      }
    } else {
      pool = INITIAL_QUESTION_BANK.slice(0, 6);
    }

    setQuestions(pool.length > 0 ? pool : INITIAL_QUESTION_BANK.slice(0, 5));
  }, [area, topic, isDiagnostic]);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeSpentSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleSubmitTest = () => {
    if (questions.length === 0) return;

    let correctCount = 0;
    const details: AttemptDetail[] = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        question: q.question,
        selectedOption: selected,
        correctOption: q.correctIndex,
        isCorrect,
        timeSpentSeconds: Math.round(timeSpentSeconds / questions.length),
        topic: q.topic,
        area: q.area,
      };
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const targetArea: PlacementArea = isDiagnostic ? 'dsa' : (area || 'aptitude');

    const newAttempt: Attempt = {
      id: `att-${Date.now()}`,
      userId,
      testType: isDiagnostic ? 'diagnostic' : 'practice',
      area: targetArea,
      topic: topic || (isDiagnostic ? '6-Area Diagnostic' : currentQ?.topic),
      score: scorePercent,
      totalQuestions: questions.length,
      correctCount,
      timeSpentSeconds,
      timestamp: new Date().toISOString(),
      details,
    };

    setSubmittedAttempt(newAttempt);
    setIsSubmitted(true);
    onComplete(newAttempt);
  };

  // Call Server-side Gemini AI for Guiding Hint
  const handleRequestHint = async () => {
    if (!currentQ) return;
    setAiLoading(true);
    setAiHint(null);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          options: currentQ.options,
          topic: currentQ.topic,
          area: currentQ.area,
          mode: 'hint',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiHint(data.text);
      } else {
        setAiHint(currentQ.hints?.[0] || 'Focus on the core fundamental property and eliminate improbable options.');
      }
    } catch {
      setAiHint(currentQ.hints?.[0] || 'Focus on the core fundamental property and eliminate improbable options.');
    } finally {
      setAiLoading(false);
    }
  };

  // Call Server-side Gemini AI for Step-by-Step Explanation
  const handleRequestExplanation = async () => {
    if (!currentQ) return;
    setAiLoading(true);
    setAiExplanation(null);
    const selectedIdx = selectedAnswers[currentIndex];
    const selectedText = selectedIdx !== undefined && selectedIdx >= 0 ? currentQ.options[selectedIdx] : 'Unanswered';

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          options: currentQ.options,
          selectedOption: selectedText,
          correctOption: currentQ.options[currentQ.correctIndex],
          topic: currentQ.topic,
          area: currentQ.area,
          mode: 'full',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiExplanation(data.text);
      } else {
        setAiExplanation(currentQ.explanation);
      }
    } catch {
      setAiExplanation(currentQ.explanation);
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${String(remainder).padStart(2, '0')}`;
  };

  if (questions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-5 md:p-7 shadow-2xl relative my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {isDiagnostic ? '6-Area Diagnostic' : PLACEMENT_AREAS[currentQ.area]?.shortName || 'Practice Set'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentQ.topic}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-1">
              {isDiagnostic ? 'Placement Readiness Assessment' : `Practice Session: ${topic || currentQ.topic}`}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpentSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 py-4 pr-1 space-y-5">
          {!isSubmitted ? (
            <>
              {/* Question Navigation Bubbles */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <div className="flex items-center gap-1.5">
                  {questions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setAiHint(null);
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                          isCurrent
                            ? 'bg-sky-500 text-slate-950 ring-2 ring-sky-300'
                            : isAnswered
                              ? 'bg-slate-700 text-slate-100'
                              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <p className="text-sm md:text-base font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                  {currentQ.question}
                </p>

                {currentQ.codeSnippet && (
                  <pre className="mt-3 p-3 bg-slate-950 rounded-xl text-sky-300 text-xs font-mono border border-slate-800 overflow-x-auto">
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-400 text-sky-100 shadow-md ring-1 ring-sky-400'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                        isSelected ? 'bg-sky-400 text-slate-900' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {letter}
                      </span>
                      <span className="leading-snug pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* AI Hint Prompt before submitting */}
              <div className="pt-2">
                {!aiHint ? (
                  <button
                    onClick={handleRequestHint}
                    disabled={aiLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{aiLoading ? 'PrePilot AI generating hint...' : 'Stuck? Get an AI Hint'}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2.5 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-400 font-semibold mb-0.5">PrePilot AI Guiding Hint:</strong>
                      <span>{aiHint}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="space-y-5 animate-fade-in">
              {/* Score summary banner */}
              <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-sky-500/40 text-center relative overflow-hidden">
                <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-white">Assessment Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your skill profile and placement recommendations have been updated live.
                </p>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-5">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Score</span>
                    <span className="text-xl font-mono font-extrabold text-sky-400">
                      {submittedAttempt?.score}%
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Accuracy</span>
                    <span className="text-xl font-mono font-extrabold text-emerald-400">
                      {submittedAttempt?.correctCount}/{submittedAttempt?.totalQuestions}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Time Taken</span>
                    <span className="text-xl font-mono font-extrabold text-amber-400">
                      {formatTime(timeSpentSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>Question Review & Explanations</span>
                </h5>

                {submittedAttempt?.details.map((detail, idx) => {
                  const q = questions[idx];
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs ${
                        detail.isCorrect 
                          ? 'bg-slate-800/40 border-emerald-500/30' 
                          : 'bg-slate-800/40 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-300">
                          Question {idx + 1}: {detail.topic}
                        </span>
                        {detail.isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      <p className="text-slate-200 font-medium mb-3">{detail.question}</p>

                      <div className="space-y-1.5 pl-2 border-l-2 border-slate-700 text-[11px]">
                        <div>
                          <span className="text-slate-400">Your choice: </span>
                          <span className={detail.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {detail.selectedOption >= 0 ? q.options[detail.selectedOption] : 'Not answered'}
                          </span>
                        </div>
                        {!detail.isCorrect && (
                          <div>
                            <span className="text-slate-400">Correct answer: </span>
                            <span className="text-emerald-400 font-bold">
                              {q.options[detail.correctOption]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Official Explanation */}
                      <div className="mt-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300">
                        <strong className="text-sky-300 block mb-1">Standard Explanation:</strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                        {q.timeComplexity && (
                          <div className="mt-2 font-mono text-[10px] text-amber-300">
                            ⚡ {q.timeComplexity}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Step-by-Step Deep Dive */}
              <div className="pt-2">
                {!aiExplanation ? (
                  <button
                    onClick={handleRequestExplanation}
                    disabled={aiLoading}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 font-bold text-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>{aiLoading ? 'PrePilot AI Tutor analyzing solution...' : 'Generate In-Depth AI Explanation & Time Complexity Tips'}</span>
                  </button>
                ) : (
                  <div className="p-4 bg-slate-800/80 border border-sky-500/30 rounded-2xl text-xs text-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-sky-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>PrePilot AI Tutor Deep Dive</span>
                    </div>
                    <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans">
                      {aiExplanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => {
                  setCurrentIndex(prev => Math.max(0, prev - 1));
                  setAiHint(null);
                }}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
                      setAiHint(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : null}

                <button
                  onClick={handleSubmitTest}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-sky-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Assessment</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-sky-500/25"
              >
                Return to Dynamic Dashboard
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

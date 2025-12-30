import React, { useState } from 'react';
import { VaultCard } from './ui/VaultCard';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which property ensures that a transaction is 'all or nothing'?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correct: "Atomicity"
    },
    {
      id: 2,
      text: "Which property protects data when multiple users access it simultaneously?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correct: "Isolation"
    },
    {
      id: 3,
      text: "If the server loses power 0.1s after a commit, which property guarantees the data is safe?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correct: "Durability"
    }
  ];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correct ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <VaultCard title="Certification Exam">
        {!submitted ? (
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="space-y-3">
                <h3 className="text-lg font-bold text-slate-200">{q.id}. {q.text}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt) => (
                    <label 
                      key={opt}
                      className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-all ${answers[q.id] === opt ? 'bg-blue-900 border-blue-500 text-blue-100' : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}`}
                    >
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        value={opt}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? 'border-blue-400 bg-blue-400' : 'border-slate-500'}`}>
                         {answers[q.id] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < 3}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded shadow-[0_4px_0_rgb(6,95,70)] active:translate-y-1 active:shadow-none transition-all"
              >
                Submit Answers
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="inline-block p-6 bg-slate-800 rounded-full border-4 border-slate-700 mb-6">
              <Trophy className={`w-16 h-16 ${score === 3 ? 'text-amber-400' : 'text-slate-400'}`} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete</h2>
            <p className="text-slate-400 mb-8">You scored <span className="text-emerald-400 font-bold text-xl">{score} / 3</span></p>
            
            <div className="max-w-md mx-auto space-y-4 text-left">
              {questions.map((q) => (
                <div key={q.id} className="p-4 bg-slate-800 rounded border border-slate-700 flex items-start gap-3">
                  {answers[q.id] === q.correct ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-sm text-slate-300 font-bold mb-1">{q.text}</div>
                    <div className="text-xs text-slate-500">Correct: {q.correct}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
               onClick={() => { setSubmitted(false); setAnswers({}); }}
               className="mt-8 text-slate-400 hover:text-white underline"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </VaultCard>
    </div>
  );
};
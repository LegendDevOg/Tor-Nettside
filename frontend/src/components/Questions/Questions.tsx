import he from "he";
import { useState, useEffect } from "react";

interface QuestionProps {
  id: number;
  handleClick: (value: string) => void;
  singleQuestion: {
    question: string;
    correct_answer: string | string[];
    options?: string[];
    context?: string; // ✅ Include context for introductory text
    difficulty?: string;
  };
  summary: boolean;
  trueAnswer: string | string[];
  userAnswer: string | null;
  showFeedback?: boolean;
}

// Normalize strings for comparison (trim whitespace and normalize spaces)
const normalizeAnswer = (answer: string | null | undefined): string => {
  if (!answer) return "";
  return answer.trim().replace(/\s+/g, ' ');
};

function Question({ id, handleClick, singleQuestion, summary, trueAnswer, userAnswer, showFeedback = false }: QuestionProps) {
  const { question, options, context } = singleQuestion;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(userAnswer);

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(userAnswer);
  }, [id, singleQuestion.question, userAnswer]);

  const handleOptionClick = (opt: string) => {
    if (!summary) {
      setSelectedAnswer(opt);
      handleClick(opt);
    }
  };

  return (

    <section className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">

      {/* <h2 className="text-2xl font-bold text-black-300 mb-6 text-center">
        {singleQuestion.difficulty}<span className="text-gray-800"></span>
      </h2> */}

      {/* Context Message (if available) */}
      {context && context.trim() !== "" && (
        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-4 rounded-md">
          <div className="text-gray-700 italic space-y-1">
            {he.decode(context).split("\n").map((line, i) =>
              line.trim() === "" ? <div key={i} className="h-4" /> : <p key={i}>{line}</p>
            )}
          </div>
        </div>
      )}

      {/* Question Number and Text */}
      {question && question.trim() !== "" && (
        <div className="flex items-start gap-3 text-base md:text-lg mb-6">
          {summary && (
            <span className="bg-primary-100 text-primary-800 font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap">
              #{id}
            </span>
          )}
          <div className="text-gray-900 font-semibold space-y-1">
            <span className={!summary ? "font-semibold" : ""}>{!summary && `${id}. `}</span>
            {he.decode(question).split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Answer Options - Ensuring Equal Size */}
      <div className="grid grid-cols-1 gap-4">
        {options && options.map((opt, i) => {
          let bgColor = "bg-gray-100"; // Default color
          let textColor = "text-gray-900";
          let hover = ""

          if (summary) {
            if (normalizeAnswer(opt) === normalizeAnswer(trueAnswer as string)) {
              bgColor = "bg-success-500 text-white"; // ✅ Correct answer in green
            } else if (normalizeAnswer(opt) === normalizeAnswer(userAnswer) && normalizeAnswer(opt) !== normalizeAnswer(trueAnswer as string)) {
              bgColor = "bg-danger-500 text-white"; // ❌ Wrong answer in red
            }
          } else if (showFeedback && selectedAnswer) {
            // Show feedback in listening mode after selection
            if (normalizeAnswer(opt) === normalizeAnswer(selectedAnswer)) {
              bgColor = "bg-primary-400 text-white border-2 border-primary-600"; // Highlight selected answer
            }
          } else {
            hover = "hover:bg-primary-100 transition"
          }

          return (
            <button
              key={i}
              onClick={!summary ? () => handleOptionClick(opt) : undefined}
              className={`w-full min-h-[64px] flex items-center justify-center text-center px-4 py-3 rounded-lg font-medium text-lg md:text-xl ${bgColor} ${textColor} transition-all ${hover} ${!summary ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Show feedback after selection in listening mode */}
      {!summary && showFeedback && selectedAnswer && (
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-primary-600">✓ Svar registrert</p>
        </div>
      )}

      {/* Show answer status in summary mode */}
      {summary && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Your Answer:</span>
            <span
              className={`px-3 py-1 rounded-lg font-medium ${!userAnswer
                ? "bg-danger-100 text-danger-700"
                : normalizeAnswer(userAnswer) === normalizeAnswer(trueAnswer as string)
                  ? "bg-success-100 text-success-700"
                  : "bg-danger-100 text-danger-700"
              }`}
            >
              {!userAnswer ? "⚠ No answer" : normalizeAnswer(userAnswer) === normalizeAnswer(trueAnswer as string) ? "Correct" : "Wrong"}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default Question;

import he from "he";

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
}

function Question({ id, handleClick, singleQuestion, summary, trueAnswer, userAnswer }: QuestionProps) {
  const { question, options, context } = singleQuestion;

  return (
  
    <section className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">

    <h1 className="text-4xl font-bold text-black-300 mb-6 text-center">
      Flervalgsoppgave<span className="text-gray-800"></span>
    </h1>

    <h2 className="text-2xl font-bold text-black-300 mb-6 text-center">
      {singleQuestion.difficulty}<span className="text-gray-800"></span>
    </h2>

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
            if (opt === trueAnswer) {
              bgColor = "bg-success-500 text-white"; // ✅ Correct answer in green
            } else if (opt === userAnswer && opt !== trueAnswer) {
              bgColor = "bg-danger-500 text-white"; // ❌ Wrong answer in red
            }
          } else {
            hover = "hover:bg-primary-100 transition"
          }

          return (
            <button
              key={i}
              onClick={!summary ? () => handleClick(opt) : undefined} // ✅ Disable click in summary mode
              className={`w-full min-h-[64px] flex items-center justify-center text-center px-4 py-3 rounded-lg font-medium text-lg md:text-xl ${bgColor} ${textColor} transition-all ${hover}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      
      {/* Show answer status in summary mode */}
      {summary && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Your Answer:</span>
            <span
              className={`px-3 py-1 rounded-lg font-medium ${
                !userAnswer
                  ? "bg-danger-100 text-danger-700"
                  : userAnswer === trueAnswer
                    ? "bg-success-100 text-success-700"
                    : "bg-danger-100 text-danger-700"
              }`}
            >
              {!userAnswer ? "⚠ No answer" : userAnswer === trueAnswer ? "Correct" : "Wrong"}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default Question;

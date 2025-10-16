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
      {context && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4 rounded-md">
          <div className="text-gray-700 italic space-y-1">
  {context && he.decode(context).split("\n").map((line, i) =>
    line.trim() === "" ? <div key={i} className="h-4" /> : <p key={i}>{line}</p>
  )}
</div>
        </div>
      )}

      {/* Question Number and Text */}
      <div className="flex items-start gap-3 text-base md:text-lg mb-6">
      {summary && (
        <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap">
          #{id}
        </span>
      )}
      <div className="text-gray-900 font-semibold space-y-1">
        <span className={!summary ? "font-semibold" : ""}>{!summary && `${id}. `}</span>
        {question && he.decode(question).split("\n").map((line, i) => (
        <p key={i}>{line}</p>
        ))}
      </div>
</div>

      {/* Answer Options - Ensuring Equal Size */}
      <div className="grid grid-cols-1 gap-4">
      {options && options.map((opt, i) => {
          let bgColor = "bg-gray-100"; // Default color
          let textColor = "text-gray-900";
          let hover = ""
          if (summary) {
            if (opt === trueAnswer) {
              bgColor = "bg-green-500 text-white"; // ✅ Correct answer in green
            } else if (opt === userAnswer && opt !== trueAnswer) {
              bgColor = "bg-red-500 text-white"; // ❌ Wrong answer in red
            }
          } else {
            hover = "hover:bg-blue-400 transition"
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
    </section>
  );
}

export default Question;

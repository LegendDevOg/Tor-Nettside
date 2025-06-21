import useQuestionStore from "../../data/GetData";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import Question from "../../components/Questions/Questions";

function Success() {
  const {
    trueAnswer,
    falseAnswer,
    resetQuestion,
    setTimeStamp,
    question: allQuestion,
    userAnswer, // ✅ Get user answers from Zustand
  } = useQuestionStore();

  const navigate = useNavigate();
  const score = Math.floor((trueAnswer * 100) / allQuestion.length);
  const indxColor = score >= 60 ? "#10b981" : score >= 30 ? "#F59E0B" : "#dc2626";
  const showButton = score >= 60;
  let text = ""
  if(score > 60) {
    text = "You got less than 60%. Practice sets 1, 2 and 3 for A1-A2 before moving on to A2-B1."
  } else {
    text = "You got more than 60%. If you want, continue to A2-B1 Level."
  }
  useEffect(() => {
    setTimeStamp(0);
  }, []);

  const handleClick = () => {
    resetQuestion();
    navigate("/");
  };

  return (
    <AnimateProvider className="flex flex-col space-y-10 md:max-w-xl md:mx-auto">
      <h3 className="text-lg text-center text-neutral-900 font-bold md:text-xl">
        Your Final Score
      </h3>

      <h1
        style={{ background: indxColor }}
        className="text-5xl font-bold mx-auto p-5 rounded-full md:text-6xl text-neutral-100"
      >
        {score}%
      </h1>

      <div className="text-xs md:text-sm text-neutral-600 font-medium flex flex-col space-y-1">

      <h1
        className="flex justify-between mb-6 text-blue-600"
      >
        {text}
      </h1>
        <p className="flex justify-between">
          Correct Answers <span className="text-green-600">{trueAnswer}</span>
        </p>
        <p className="flex justify-between">
          Wrong Answers <span className="text-red-600">{falseAnswer}</span>
        </p>
        <p className="flex justify-between">
          Total Submitted <span className="text-purple-600">{trueAnswer + falseAnswer}</span>
        </p>
      </div>

      {showButton && (
        <button
         onClick={handleClick}
          className="grid place-items-center text-neutral-50 bg-blue-500 rounded-full py-2 hover:text-blue-200 text-sm font-semibold"
          >
          Continue to A2-B1 Test
        </button>
      )}

    {!showButton && (
        <button
         onClick={handleClick}
          className="grid place-items-center text-neutral-50 bg-blue-500 rounded-full py-2 hover:text-blue-200 text-sm font-semibold"
          >
          Go back to A1-A2 sets
        </button>
      )}

      {/* Answer Summary */}
      <h3 className="text-center text-neutral-600 font-semibold md:text-lg pt-[100px]">
        Answers
      </h3>
      {allQuestion.map((question, i) => {
  const userSelected = userAnswer.find((ans) => ans.question === question.question);
  const isWordSelection = question.type === "word-selection";
  const isImageSelection = question.type === "image";

  const isSentenceDropdown = question.type === "sentence-dropdown";

if (isSentenceDropdown) {
  const parts = question.sentenceParts || [];
  const correct = question.correct_answer;
  const selected = userSelected?.answer
    ?.split("||")
    .sort()
    .map((a) => a.split("|")[1]);

  return (
    <div key={i} className="bg-white p-4 rounded-lg shadow-md">
      <h4 className="font-semibold mb-2">{question.question}</h4>
      <p className="text-gray-800 leading-relaxed text-lg">
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            <span
              className={`mx-1 px-2 py-1 rounded font-medium ${
                selected?.[idx] === correct[idx]
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {selected?.[idx] || "–"}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}

  return isWordSelection ? (
    <div key={i} className="bg-white p-4 rounded-lg shadow-md">
      <h4 className="font-semibold">{question.question}</h4>
      <p className="text-gray-700 mt-2">
        <span className="font-bold">Your Answer: </span>
        <span className={userSelected?.answer === question.correct_answer ? "text-green-600" : "text-red-600"}>
          {userSelected?.answer || "No answer"}
        </span>
      </p>
      <p className="text-gray-700">
        <span className="font-bold">Correct Answer: </span>
        <span className="text-green-600">{question.correct_answer}</span>
      </p>
    </div>
  ) : isImageSelection ? (
    <div key={i} className="bg-white p-4 rounded-lg shadow-md">
      <h4 className="font-semibold">{question.question}</h4>
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {(question.options ?? []).map((option, index) => { // ✅ Ensure options is always an array
          const isCorrect = option === question.correct_answer;
          const isUserSelected = option === userSelected?.answer;
          
          return (
            <img
              key={index}
              src={option}
              alt={`Option ${index}`}
              className={`max-w-[180px] max-h-[180px] object-contain rounded-lg border-4 
                ${isCorrect ? "border-green-500" : isUserSelected && !isCorrect ? "border-red-500" : "border-gray-300"}`}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <Question
      key={i}
      singleQuestion={question}
      handleClick={() => {}} 
      id={i + 1}
      summary={true}
      trueAnswer={question.correct_answer}
      userAnswer={userSelected ? userSelected.answer : null}
    />
  );
})}

    </AnimateProvider>
  );
}

export default Success;

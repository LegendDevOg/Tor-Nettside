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
  const indxColor = score >= 80 ? "#10b981" : score >= 60 ? "#F59E0B" : "#dc2626";

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

      <button
        onClick={handleClick}
        className="grid place-items-center text-neutral-50 bg-orange-500 rounded-full py-2 hover:text-neutral-50 text-sm font-semibold"
      >
        Continue to A2 Test
      </button>

      {/* Answer Summary */}
      <h3 className="text-center text-neutral-600 font-semibold md:text-lg pt-[100px]">
        Answers
      </h3>
      {allQuestion.map((question, i) => {
        const userSelected = userAnswer.find((ans) => ans.question === question.question);
        return (
          <Question
            key={i}
            singleQuestion={question}
            handleClick={() => {}} // ✅ Disable clicking in summary mode
            id={i + 1}
            summary={true}
            trueAnswer={question.correct_answer}
            userAnswer={userSelected ? userSelected.answer : null} // ✅ Pass user's selected answer
          />
        );
      })}
    </AnimateProvider>
  );
}

export default Success;

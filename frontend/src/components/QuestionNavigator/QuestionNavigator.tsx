import useQuestionStore from "../../data/GetData";

function QuestionNavigator() {
  const { question: allQuestions, userAnswer: allUserAnswers, page, setPage } = useQuestionStore();

  // Check if a question has been answered
  const isAnswered = (questionIndex: number) => {
    const question = allQuestions[questionIndex];
    return allUserAnswers.some((ans) => ans.question === question?.question);
  };

  return (
    <div className="flex justify-center items-center gap-2 my-6 flex-wrap">
      {allQuestions.map((_, index) => {
        const questionNumber = index + 1;
        const answered = isAnswered(index);
        const isCurrent = page === questionNumber;

        return (
          <button
            key={index}
            onClick={() => setPage(questionNumber)}
            className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 
              ${isCurrent
                ? answered
                  ? "bg-success-500 text-white ring-2 ring-success-300 ring-offset-2"
                  : "bg-gray-400 text-white ring-2 ring-gray-300 ring-offset-2"
                : answered
                  ? "bg-success-400 text-white hover:bg-success-500"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
          >
            {questionNumber}
          </button>
        );
      })}
    </div>
  );
}

export default QuestionNavigator;


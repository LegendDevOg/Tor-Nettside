import { useNavigate, useParams } from "react-router-dom";
import TimeStamp from "../../components/TimeStamp/TimeStamp";
import { useEffect } from "react";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import useQuestionStore from "../../data/GetData";
import Question from "../../components/Questions/Questions";
import { ImageQuestion, WordSelectionQuestion, ParagraphSelectionQuestion } from "../../components/QuestionTypes/QuestionTypes";

function SingleQuestion() {
  const navigate = useNavigate();
  const {
    question: allQuestion,
    trueAction,
    falseAction,
    addAnswer,
    page,
    nextPage,
    userAnswer: allUserAnswers, // ✅ Fetch user answers from the store
  } = useQuestionStore();

  const { id } = useParams();
  const singleQuestion = allQuestion?.[page - 1];

  useEffect(() => {
    if (Number(id) < page) {
      navigate(`/question/${page}`);
    }
  }, [id]);

  if (!singleQuestion) return <p>Loading...</p>; // Prevents undefined errors

  // ✅ Retrieve the specific answer for this question
  const userAnswer = allUserAnswers.find((ans) => ans.question === singleQuestion?.question);

  const handleClick = (value: string) => {
    addAnswer({ question: singleQuestion.question, answer: value });

    if (value === singleQuestion.correct_answer) {
      trueAction();
    } else {
      falseAction();
    }

    nextPage();
    navigate(page === allQuestion.length ? "/finish" : `/question/${Number(id) + 1}`);
  };

  function renderQuestionComponent() {
    switch (singleQuestion.type) {
      case "image":
        return (
          <ImageQuestion
            question={singleQuestion.question}
            options={singleQuestion.options || []}
            correctAnswer={singleQuestion.correct_answer}
            handleClick={handleClick}
            userAnswer={userAnswer?.answer || ""}
            summary={false}
          />
        );
      case "word-selection":
        return (
          <WordSelectionQuestion
            question={singleQuestion.question}
            sentence={singleQuestion.sentence || ""}
            correctWord={singleQuestion.correct_answer}
            handleClick={handleClick}
            summary={false}
          />
        );
      case "paragraph-selection":
        return (
          <ParagraphSelectionQuestion
            question={singleQuestion.question}
            paragraphs={singleQuestion.paragraphs || []}
            correctParagraph={singleQuestion.correct_answer}
            handleClick={handleClick}
            userAnswer={userAnswer?.answer || ""}
            summary={false}
          />
        );
      default:
        return (
          <Question
            id={page}
            handleClick={handleClick}
            singleQuestion={singleQuestion}
            summary={false}
            trueAnswer={singleQuestion.correct_answer}
            userAnswer={userAnswer?.answer || ""}
          />
        );
    }
  }

  return (
    <AnimateProvider className="max-w-xl mx-auto">
      <div className="flex max-w-fit flex-col ml-auto space-x-3 mb-10">
        <TimeStamp />
      </div>
      {renderQuestionComponent()}
    </AnimateProvider>
  );
}

export default SingleQuestion;

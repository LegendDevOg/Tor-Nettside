import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import useQuestionStore from "../../data/GetData";
import Question from "../../components/Questions/Questions";
import QuestionNavigator from "../../components/QuestionNavigator/QuestionNavigator";
import Header from "../../components/Header/Header";
import ScaledContent from "../../components/ScaledContent/ScaledContent";

import {
  ImageQuestion,
  WordSelectionQuestion,
  ParagraphSelectionQuestion,
  SentenceDropdownQuestion,
  ImageClickAreaQuestion
} from "../../components/QuestionTypes/QuestionTypes";

function SingleQuestion() {
  const navigate = useNavigate();
  const { id, set } = useParams(); // Now set = "1"
  const filename = `${id}-${set}`;

  // Access Zustand store state
  const {
    question: allQuestions,
    userAnswer: allUserAnswers,
    trueAction,
    falseAction,
    addAnswer,
    page,
    nextPage,
    prevPage,
  } = useQuestionStore();

  const singleQuestion = allQuestions?.[page - 1]; // Get the current question based on the page

  useEffect(() => {
    if (!allQuestions.length) {
      useQuestionStore.getState().fetchQuestion(filename);
    }
  }, [id, allQuestions, page, set]);

  if (!singleQuestion) return <p>Loading... {filename}</p>;

  const userAnswer = allUserAnswers.find((ans) => ans.question === singleQuestion?.question);

  const handleClick = (value: string) => {
    addAnswer({ question: singleQuestion.question, answer: value });

    if (value === singleQuestion.correct_answer) {
      trueAction();
    } else {
      falseAction();
    }

    nextPage();
    navigate(page === allQuestions.length ? "/finish" : `/question/${id}/${set}`);
  };

  function renderQuestionComponent() {
    switch (singleQuestion.type) {
      case "image-click":
          if (!singleQuestion.correctArea || !singleQuestion.image) {
            return <p>Error: Missing image or correct area data for image-click question.</p>;
          }
          
        return (
          <ImageClickAreaQuestion
            question={singleQuestion.question}
            context={singleQuestion.context}
            image={singleQuestion.image || ""}
            correctArea={singleQuestion.correctArea}
            handleClick={(answerString) => {
              const [correctness] = answerString.split("|");

              addAnswer({
              question: singleQuestion.question,
              answer: answerString, // ✅ store full "x|y|correct"
              });

            correctness === "correct" ? trueAction() : falseAction();

              nextPage();
              navigate(page === allQuestions.length ? "/finish" : `/question/${id}/${set}`);
            }}
            summary={false}
            difficulty={singleQuestion.difficulty || ""}
          />
        );
      case "image":
        return (
          <ImageQuestion
            question={singleQuestion.question}
            options={singleQuestion.options || []}
            correctAnswer={singleQuestion.correct_answer}
            handleClick={handleClick}
            summary={false}
            imageSrc={singleQuestion.image || null}
            sentence={singleQuestion.sentence || null}
            difficulty={singleQuestion.difficulty || ""}
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
            difficulty={singleQuestion.difficulty || ""}
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
        case "sentence-dropdown":
  if (
    !Array.isArray(singleQuestion.sentenceParts) ||
    !Array.isArray(singleQuestion.dropdownOptions) ||
    !Array.isArray(singleQuestion.correct_answer)
  ) {
    return <p className="text-red-600">Feil: Mangler data for sentence-dropdown</p>;
  }

  return (
    <SentenceDropdownQuestion
      sentenceParts={singleQuestion.sentenceParts}
      options={singleQuestion.dropdownOptions}
      correctAnswers={singleQuestion.correct_answer}
      userAnswer={
        userAnswer?.answer
          ? userAnswer.answer
              .split("||")
              .sort()
              .map((a) => a.split("|")[1])
          : []
      }
      handleClick={(val) => {
        addAnswer({
          question: singleQuestion.question,
          answer: val,
        });

        const selectedAnswers = val
          .split("||")
          .map((entry) => entry.split("|")[1]);

        const isCorrect = selectedAnswers.every(
          (ans, i) => ans === singleQuestion.correct_answer[i]
        );

        isCorrect ? trueAction() : falseAction();

        nextPage();
        navigate(page === allQuestions.length ? "/finish" : `/question/${id}/${set}`);
      }}

      summary={false}
      difficulty={singleQuestion.difficulty || ""}
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

  const handlePrevious = () => {
    if (page > 1) {
      prevPage();
    }
  };

  const handleNext = () => {
    if (page < allQuestions.length) {
      nextPage();
    }
  };

  return (
    <>
      <Header />
      <ScaledContent>
        <AnimateProvider className="max-w-[65vw] mx-auto">
          {/* ✅ Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mt-6 mb-2">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(page / allQuestions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-700 mb-6">
            Spørsmål {page} av {allQuestions.length}
          </p>

          {/* Question Navigator */}
          <QuestionNavigator />

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              ← Forrige
            </button>
            <button
              onClick={handleNext}
              disabled={page === allQuestions.length}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                page === allQuestions.length
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Neste →
            </button>
          </div>

          <div className="flex max-w-fit flex-col ml-auto space-x-3 mb-10">
            {/* TimeStamp Component */}
          </div>
          {renderQuestionComponent()}
        </AnimateProvider>
      </ScaledContent>
    </>
  );
}

export default SingleQuestion;

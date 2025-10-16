import useQuestionStore from "../../data/GetData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import Question from "../../components/Questions/Questions";
import Header from "../../components/Header/Header";
import ScaledContent from "../../components/ScaledContent/ScaledContent";

// Separate component for image-click results to avoid conditional hooks
function ImageClickResult({ question, userSelected, actualIndex }: {
  question: any;
  userSelected: any;
  actualIndex: number;
}) {
  const [clickedX, clickedY, correctness] = (userSelected?.answer || "").split("|");
  const correctX = question.correctArea.x;
  const correctY = question.correctArea.y;
  const radius = question.correctArea.radius;

  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      const updateSize = () =>
        setImageSize({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });

      if (img.complete) updateSize();
      else img.onload = updateSize;
    }
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
          #{actualIndex + 1}
        </span>
        <h4 className="font-semibold">{question.question}</h4>
      </div>
      <div className="relative inline-block w-full max-w-md mx-auto">
        <img
          ref={imgRef}
          src={`/images/${question.image}`}
          alt="result"
          className="rounded-lg w-full h-auto object-contain"
        />

        {/* Correct clickable area */}
        <div
          className="absolute border-2 border-green-500 bg-green-200 bg-opacity-40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            top: `${(correctY / imageSize.height) * 100}%`,
            left: `${(correctX / imageSize.width) * 100}%`,
            width: `${(radius * 2 / imageSize.width) * 100}%`,
            height: `${(radius * 2 / imageSize.height) * 100}%`,
          }}
        />

        {/* User's click marker */}
        {!clickedX || !clickedY ? (
          <p className="text-xs text-yellow-600 mt-2">⚠️ No click data was recorded.</p>
        ) : (
          <div
            className="absolute w-[14px] h-[14px] bg-red-600 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              top: `${(parseFloat(clickedY) / imageSize.height) * 100}%`,
              left: `${(parseFloat(clickedX) / imageSize.width) * 100}%`,
            }}
          />
        )}
      </div>
      <p className="mt-2 text-sm">
        Your click was{" "}
        <span
          className={
            correctness === "correct"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {correctness === "correct" ? "correct" : "wrong"}
        </span>
        .
      </p>
    </div>
  );
}

function Success() {
  const {
    trueAnswer,
    falseAnswer,
    resetQuestion,
    setTimeStamp,
    question: allQuestion,
    userAnswer,
  } = useQuestionStore();

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const score = Math.floor((trueAnswer * 100) / allQuestion.length);
  const indxColor = score >= 60 ? "#10b981" : score >= 30 ? "#F59E0B" : "#dc2626";
  const showButton = score >= 60;
  const text =
    score < 60
      ? "You got less than 60%. Practice sets 1, 2 and 3 for this level before moving on to the next level."
      : "You got more than 60%. If you want, continue to the next Level.";

  useEffect(() => {
    setTimeStamp(0);
  }, []);

  const handleClick = () => {
    resetQuestion();
    navigate("/");
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < allQuestion.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Header />
      <ScaledContent>
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
        <h1 className="flex justify-between mb-6 text-blue-600">{text}</h1>
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
        className="grid place-items-center text-neutral-50 bg-blue-500 rounded-full py-2 hover:text-blue-200 text-sm font-semibold"
      >
        {showButton ? "Continue to A2-B1 Test" : "Go back to A1-A2 sets"}
      </button>

      {/* Question Overview Grid */}
      <div className="pt-10">
        <h3 className="text-center text-neutral-600 font-semibold md:text-lg mb-4">
          Oversikt over oppgaver
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {allQuestion.map((question, index) => {
            const userSelected = userAnswer.find((ans) => ans.question === question.question);
            let isCorrect = false;

            // Check if answer is correct based on question type
            if (question.type === "sentence-dropdown") {
              const selected = userSelected?.answer
                ?.split("||")
                .map((a) => a.split("|")[1]);
              isCorrect = selected?.every((ans, i) => ans === question.correct_answer[i]) || false;
            } else if (question.type === "image-click") {
              const [, , correctness] = (userSelected?.answer || "").split("|");
              isCorrect = correctness === "correct";
            } else {
              isCorrect = userSelected?.answer === question.correct_answer;
            }

            return (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`aspect-square rounded-lg font-bold text-sm transition-all
                  ${currentPage === index + 1 ? "ring-4 ring-blue-400 scale-110" : ""}
                  ${isCorrect 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-red-500 text-white hover:bg-red-600"
                  }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Summary */}
      <h3 className="text-center text-neutral-600 font-semibold md:text-lg pt-[50px]">
        Svar på oppgave {currentPage}
      </h3>

      {/* Navigation for Summary */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          ← Forrige
        </button>
        <span className="text-sm text-gray-700 font-medium">
          Oppgave {currentPage} av {allQuestion.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === allQuestion.length}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            currentPage === allQuestion.length
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Neste →
        </button>
      </div>

      {allQuestion.filter((_, i) => i === currentPage - 1).map((question) => {
        const actualIndex = currentPage - 1;
        const userSelected = userAnswer.find((ans) => ans.question === question.question);
        const isWordSelection = question.type === "word-selection";
        const isImageSelection = question.type === "image";
        const isSentenceDropdown = question.type === "sentence-dropdown";
        const isImageClick = question.type === "image-click";

        if (isSentenceDropdown) {
          const correct = question.correct_answer;
          const sentence = (question.sentenceParts || []).join("");
          const selected = userSelected?.answer
            ?.split("||")
            .map((a) => {
              const [indexStr, value] = a.split("|");
              return { index: parseInt(indexStr), value };
            })
            .sort((a, b) => a.index - b.index);

          const sentenceSegments = sentence.split(/(\{\d+\})/g); // behold {}-blokkene

          return (
            <div key={actualIndex} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                  #{actualIndex + 1}
                </span>
                <h4 className="font-semibold">{question.question}</h4>
              </div>
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                {sentenceSegments.map((segment, idx) => {
                  const match = segment.match(/\{(\d+)\}/);
                  if (match) {
                    const index = parseInt(match[1]);
                    const userVal = selected?.[index]?.value;
                    const isCorrect = userVal === correct[index];

                    return (
                      <span
                        key={idx}
                        className={`mx-1 px-2 py-1 rounded font-medium ${
                          isCorrect
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {userVal || "–"}
                      </span>
                    );
                  } else {
                    return <span key={idx}>{segment}</span>;
                  }
                })}
              </p>
            </div>
          );
        }

if (isImageClick && question.correctArea && question.image) {
  return (
    <ImageClickResult
      key={actualIndex}
      question={question}
      userSelected={userSelected}
      actualIndex={actualIndex}
    />
  );
}

        return isWordSelection ? (
          <div key={actualIndex} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                #{actualIndex + 1}
              </span>
              <h4 className="font-semibold">{question.question}</h4>
            </div>
            <p className="text-gray-700 mt-2">
              <span className="font-bold">Your Answer: </span>
              <span
                className={
                  userSelected?.answer === question.correct_answer
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {userSelected?.answer || "No answer"}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Correct Answer: </span>
              <span className="text-green-600">{question.correct_answer}</span>
            </p>
          </div>
        ) : isImageSelection ? (
          <div key={actualIndex} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                #{actualIndex + 1}
              </span>
              <h4 className="font-semibold">{question.question}</h4>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {(question.options ?? []).map((option, index) => {
                const isCorrect = option === question.correct_answer;
                const isUserSelected = option === userSelected?.answer;

                return (
                  <img
                    key={index}
                    src={option}
                    alt={`Option ${index}`}
                    className={`max-w-[180px] max-h-[180px] object-contain rounded-lg border-4 
                      ${
                        isCorrect
                          ? "border-green-500"
                          : isUserSelected && !isCorrect
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <Question
            key={actualIndex}
            singleQuestion={question}
            handleClick={() => {}}
            id={actualIndex + 1}
            summary={true}
            trueAnswer={question.correct_answer}
            userAnswer={userSelected ? userSelected.answer : null}
          />
        );
      })}
        </AnimateProvider>
      </ScaledContent>
    </>
  );
}

export default Success;

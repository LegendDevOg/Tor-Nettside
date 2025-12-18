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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-primary-100 text-primary-800 font-bold px-4 py-2 rounded-full text-base">
          #{actualIndex + 1}
        </span>
        <h4 className="font-semibold text-lg text-gray-800">{question.question}</h4>
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
          className="absolute border-2 border-success-500 bg-success-200 bg-opacity-40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            top: `${(correctY / imageSize.height) * 100}%`,
            left: `${(correctX / imageSize.width) * 100}%`,
            width: `${(radius * 2 / imageSize.width) * 100}%`,
            height: `${(radius * 2 / imageSize.height) * 100}%`,
          }}
        />

        {/* User's click marker */}
        {clickedX && clickedY && (
          <div
            className="absolute w-[14px] h-[14px] bg-danger-600 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              top: `${(parseFloat(clickedY) / imageSize.height) * 100}%`,
              left: `${(parseFloat(clickedX) / imageSize.width) * 100}%`,
            }}
          />
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600">Your Answer:</span>
          <span
            className={`px-3 py-1 rounded-lg font-medium ${!clickedX || !clickedY
              ? "bg-danger-100 text-danger-700"
              : correctness === "correct"
                ? "bg-success-100 text-success-700"
                : "bg-danger-100 text-danger-700"
              }`}
          >
            {!clickedX || !clickedY ? "⚠ No answer" : correctness === "correct" ? "Correct" : "Wrong"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Success() {
  const {
    trueAnswer,
    resetQuestion,
    setTimeStamp,
    question: allQuestion,
    userAnswer,
  } = useQuestionStore();

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const score = Math.floor((trueAnswer * 100) / allQuestion.length);
  const indxColor = score >= 60 ? "#22c55e" : score >= 30 ? "#f59e0b" : "#de5858";
  const showButton = score >= 60;
  const text =
    score < 60
      ? "You got less than 60%. Practice sets 1, 2 and 3 for this level before moving on to the next level."
      : "You got more than 60%. If you want, continue to the next Level.";

  // Check if this is a listening quiz (questions have sound property and empty question text)
  const isLyttingQuiz = allQuestion.length > 0 && allQuestion[0]?.sound && allQuestion[0]?.question === "";

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
        <AnimateProvider className="flex flex-col space-y-8 md:max-w-2xl md:mx-auto px-4">
          {/* Score Circle */}
          <div className="flex flex-col items-center space-y-6 pt-8">
            <h3 className="text-2xl text-center text-gray-800 font-bold md:text-3xl">
              Your Final Score
            </h3>

            <div
              style={{ background: indxColor }}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center shadow-xl"
            >
              <span className="text-6xl md:text-7xl font-bold text-white">
                {score}%
              </span>
            </div>

            {/* Message */}
            <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg max-w-lg">
              <p className="text-sm md:text-base text-gray-700 text-center font-medium">
                {text}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClick}
            className="w-full max-w-md mx-auto text-white bg-primary-500 rounded-full py-3 px-8 hover:bg-primary-600 transition-all text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showButton ? "Continue to A2-B1 Test" : "Go back to A1-A2 sets"}
          </button>

          {/* Question Overview Grid */}
          <div className="pt-6 pb-4">
            <h3 className="text-center text-gray-700 font-semibold text-lg md:text-xl mb-6">
              Review Your Answers
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 max-w-3xl mx-auto">
              {allQuestion.map((question, index) => {
                // Use same identifier logic as in SingleQuestion
                const questionIdentifier = isLyttingQuiz ? `question_${index + 1}` : question.question;
                const userSelected = userAnswer.find((ans) => ans.question === questionIdentifier);
                const hasAnswer = userSelected && userSelected.answer;
                let isCorrect = false;

                // Check if answer is correct based on question type
                if (hasAnswer) {
                  if (question.type === "sentence-dropdown") {
                    const selected = userSelected?.answer
                      ?.split("||")
                      .map((a) => a.split("|")[1]);
                    isCorrect = selected?.every((ans, i) => ans === question.correct_answer[i]) || false;
                  } else if (question.type === "multi_dropdown") {
                    const selected = userSelected?.answer
                      ?.split("||")
                      .map((a) => a.split("|")[1]);
                    isCorrect = (
                      question.subQuestions &&
                      selected?.every(
                        (ans, i) => ans === question.subQuestions?.[i]?.correct_answer
                      )
                    ) || false;
                  } else if ((question as any).type === "dual_dropdown") {
                    const selected = userSelected?.answer
                      ?.split("||")
                      .map((a) => a.split("|")[1]);
                    isCorrect = (
                      question.subQuestions &&
                      selected?.every((ans, i) => {
                        const personIndex = Math.floor(i / 2);
                        const questionIndex = i % 2;
                        return ans === (question.subQuestions as any)?.[personIndex]?.correct_answers?.[questionIndex];
                      })
                    ) || false;
                  } else if (question.type === "image-click") {
                    const [, , correctness] = (userSelected?.answer || "").split("|");
                    isCorrect = correctness === "correct";
                  } else {
                    isCorrect = userSelected?.answer === question.correct_answer;
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`aspect-square rounded-lg font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center
                  ${currentPage === index + 1 ? "ring-4 ring-primary-400 scale-110 z-10" : ""}
                  ${!hasAnswer
                        ? "bg-danger-500 text-white hover:bg-danger-600"
                        : isCorrect
                          ? "bg-success-500 text-white hover:bg-success-600"
                          : "bg-danger-500 text-white hover:bg-danger-600"
                      }`}
                    title={!hasAnswer ? "No answer provided" : isCorrect ? "Correct" : "Incorrect"}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer Details Section */}
          <div className="pt-8 border-t border-gray-200">
            {/* Navigation for Summary */}
            <div className="flex justify-between items-center mb-8 gap-4 max-w-2xl mx-auto">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`flex-1 max-w-[200px] px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md ${currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg"
                  }`}
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === allQuestion.length}
                className={`flex-1 max-w-[200px] px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md ${currentPage === allQuestion.length
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg"
                  }`}
              >
                Next →
              </button>
            </div>
          </div>

          {allQuestion.filter((_, i) => i === currentPage - 1).map((question) => {
            const actualIndex = currentPage - 1;
            // Use same identifier logic as in SingleQuestion
            const questionIdentifier = isLyttingQuiz ? `question_${currentPage}` : question.question;
            const userSelected = userAnswer.find((ans) => ans.question === questionIdentifier);
            const isWordSelection = question.type === "word-selection";
            const isImageSelection = question.type === "image";
            const isSentenceDropdown = question.type === "sentence-dropdown";
            const isMultiDropdown = question.type === "multi_dropdown";
            const isDualDropdown = (question as any).type === "dual_dropdown";
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
                <div key={actualIndex} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-100 text-primary-800 font-bold px-4 py-2 rounded-full text-base">
                      #{actualIndex + 1}
                    </span>
                    <h4 className="font-semibold text-lg text-gray-800">{question.question}</h4>
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
                            className={`mx-1 px-2 py-1 rounded font-medium ${!userVal
                              ? "bg-danger-100 text-danger-700"
                              : isCorrect
                                ? "bg-success-100 text-success-700"
                                : "bg-danger-100 text-danger-700"
                              }`}
                          >
                            {userVal || "⚠"}
                          </span>
                        );
                      } else {
                        return <span key={idx}>{segment}</span>;
                      }
                    })}
                  </p>

                  {!userSelected?.answer && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-600">Status:</span>
                        <span className="px-3 py-1 rounded-lg font-medium bg-danger-100 text-danger-700">
                          ⚠ No answer provided
                        </span>
                      </div>
                    </div>
                  )}
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

            if (isMultiDropdown) {
              const selected = userSelected?.answer
                ?.split("||")
                .map((a) => {
                  const [indexStr, value] = a.split("|");
                  return { index: parseInt(indexStr), value };
                })
                .sort((a, b) => a.index - b.index);

              return (
                <div key={actualIndex} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-100 text-primary-800 font-bold px-4 py-2 rounded-full text-base">
                      #{actualIndex + 1}
                    </span>
                    <h4 className="font-semibold text-lg text-gray-800">{question.question}</h4>
                  </div>

                  <div className="space-y-4 mt-4">
                    {question.subQuestions?.map((subQ, index) => {
                      const userVal = selected?.[index]?.value;
                      const isCorrect = userVal === subQ.correct_answer;

                      return (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-700 min-w-[120px]">{subQ.label}</span>
                          <div className="flex-1 flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-lg font-medium ${!userVal
                                ? "bg-danger-100 text-danger-700"
                                : isCorrect
                                  ? "bg-success-100 text-success-700"
                                  : "bg-danger-100 text-danger-700"
                                }`}
                            >
                              {userVal || "⚠ No answer"}
                            </span>
                            {userVal && !isCorrect && (
                              <>
                                <span className="text-gray-400">→</span>
                                <span className="px-3 py-1 rounded-lg font-medium bg-success-100 text-success-700">
                                  {subQ.correct_answer}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!userSelected?.answer && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-600">Status:</span>
                        <span className="px-3 py-1 rounded-lg font-medium bg-danger-100 text-danger-700">
                          ⚠ No answer provided
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            if (isDualDropdown) {
              const selected = userSelected?.answer
                ?.split("||")
                .map((a) => {
                  const [indexStr, value] = a.split("|");
                  return { index: parseInt(indexStr), value };
                })
                .sort((a, b) => a.index - b.index);

              const dualQuestion = question as any;

              return (
                <div key={actualIndex} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-100 text-primary-800 font-bold px-4 py-2 rounded-full text-base">
                      #{actualIndex + 1}
                    </span>
                    <h4 className="font-semibold text-lg text-gray-800">{question.context || "Dual Dropdown Question"}</h4>
                  </div>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-300 bg-gray-50">
                          <th className="p-3 text-left font-semibold text-gray-800"></th>
                          <th className="p-3 text-center font-semibold text-gray-800">{dualQuestion.questions?.[0]}</th>
                          <th className="p-3 text-center font-semibold text-gray-800">{dualQuestion.questions?.[1]}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {question.subQuestions?.map((subQ: any, personIndex) => {
                          const userVal1 = selected?.[personIndex * 2]?.value;
                          const userVal2 = selected?.[personIndex * 2 + 1]?.value;
                          const isCorrect1 = userVal1 === subQ.correct_answers?.[0];
                          const isCorrect2 = userVal2 === subQ.correct_answers?.[1];

                          return (
                            <tr key={personIndex} className="border-b border-gray-200">
                              <td className="p-3 font-semibold text-gray-700">{subQ.label}</td>
                              <td className="p-3">
                                <div className="flex flex-col gap-2">
                                  <span
                                    className={`px-3 py-2 rounded-lg font-medium text-center ${!userVal1
                                      ? "bg-danger-100 text-danger-700"
                                      : isCorrect1
                                        ? "bg-success-100 text-success-700"
                                        : "bg-danger-100 text-danger-700"
                                      }`}
                                  >
                                    {userVal1 || "⚠ No answer"}
                                  </span>
                                  {userVal1 && !isCorrect1 && (
                                    <span className="px-3 py-2 rounded-lg font-medium text-center bg-success-100 text-success-700">
                                      ✓ {subQ.correct_answers?.[0]}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex flex-col gap-2">
                                  <span
                                    className={`px-3 py-2 rounded-lg font-medium text-center ${!userVal2
                                      ? "bg-danger-100 text-danger-700"
                                      : isCorrect2
                                        ? "bg-success-100 text-success-700"
                                        : "bg-danger-100 text-danger-700"
                                      }`}
                                  >
                                    {userVal2 || "⚠ No answer"}
                                  </span>
                                  {userVal2 && !isCorrect2 && (
                                    <span className="px-3 py-2 rounded-lg font-medium text-center bg-success-100 text-success-700">
                                      ✓ {subQ.correct_answers?.[1]}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {!userSelected?.answer && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-600">Status:</span>
                        <span className="px-3 py-1 rounded-lg font-medium bg-danger-100 text-danger-700">
                          ⚠ No answer provided
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return isWordSelection ? (
              <div key={actualIndex} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary-100 text-primary-800 font-bold px-4 py-2 rounded-full text-base">
                    #{actualIndex + 1}
                  </span>
                  <h4 className="font-semibold text-lg text-gray-800">{question.question}</h4>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">Your Answer:</span>
                    <span
                      className={`px-3 py-1 rounded-lg font-medium ${userSelected?.answer === question.correct_answer
                        ? "bg-success-100 text-success-700"
                        : "bg-danger-100 text-danger-700"
                        }`}
                    >
                      {userSelected?.answer || "⚠ No answer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">Correct Answer:</span>
                    <span className="px-3 py-1 rounded-lg font-medium bg-success-100 text-success-700">
                      {question.correct_answer}
                    </span>
                  </div>
                </div>
              </div>
            ) : isImageSelection ? (
              <div key={actualIndex} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary-100 text-primary-800 font-bold px-4 py-2 rounded-full text-base">
                    #{actualIndex + 1}
                  </span>
                  <h4 className="font-semibold text-lg text-gray-800">{question.question}</h4>
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
                      ${isCorrect
                            ? "border-success-500"
                            : isUserSelected && !isCorrect
                              ? "border-danger-500"
                              : "border-gray-300"
                          }`}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">Your Answer:</span>
                    <span
                      className={`px-3 py-1 rounded-lg font-medium ${!userSelected?.answer
                        ? "bg-danger-100 text-danger-700"
                        : userSelected?.answer === question.correct_answer
                          ? "bg-success-100 text-success-700"
                          : "bg-danger-100 text-danger-700"
                        }`}
                    >
                      {!userSelected?.answer ? "⚠ No answer" : userSelected?.answer === question.correct_answer ? "Correct" : "Wrong"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <Question
                key={actualIndex}
                singleQuestion={question}
                handleClick={() => { }}
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

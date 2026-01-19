import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
  ImageClickAreaQuestion,
  MultiDropdownQuestion,
  DualDropdownQuestion
} from "../../components/QuestionTypes/QuestionTypes";

// Normalize strings for comparison (trim whitespace and normalize spaces)
const normalizeAnswer = (answer: string | string[] | null | undefined): string => {
  if (!answer) return "";
  if (Array.isArray(answer)) return answer.join('|').trim().replace(/\s+/g, ' ');
  return answer.trim().replace(/\s+/g, ' ');
};

function SingleQuestion() {
  const navigate = useNavigate();
  const { category, id, set } = useParams(); // Get category (lesing/lytting), difficulty, and set
  const isLytting = category === "lytting"; // Detect if this is a listening quiz
  const filename = `${id}-${isLytting ? "Lytting-" : ""}${set}`;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [audioProgress, setAudioProgress] = useState(0); // Track audio progress (0-100)

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

  // Auto-play sound for lytting questions
  useEffect(() => {
    if (isLytting && singleQuestion?.sound) {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;

      // Reset progress when new audio loads
      setAudioProgress(0);

      // Update progress as audio plays
      const handleTimeUpdate = () => {
        if (audio.duration) {
          const progress = (audio.currentTime / audio.duration) * 100;
          setAudioProgress(progress);
        }
      };

      // Auto-advance when audio ends (regardless of whether user answered or not)
      const handleAudioEnd = () => {
        setAudioProgress(100); // Ensure it shows 100% at the end
        if (page < allQuestions.length) {
          nextPage();
          navigate(`/question/${category}/${id}/${set}`);
        } else if (page === allQuestions.length) {
          navigate("/finish");
        }
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleAudioEnd);

      // Set source and load, then play
      audio.src = singleQuestion.sound;
      audio.load(); // Important: load the new source

      // Play the audio and store the promise
      playPromiseRef.current = audio.play().catch((error) => {
        // Ignore AbortError which happens when play is interrupted by pause
        if (error.name !== 'AbortError') {
          console.error("Error playing audio:", error);
        }
      });

      // Cleanup
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleAudioEnd);

        // Pause immediately without waiting
        audio.pause();
        audio.currentTime = 0;
        playPromiseRef.current = null;
        setAudioProgress(0);
      };
    }
  }, [page, singleQuestion, isLytting]);

  if (!singleQuestion) return <p>Loading... {filename}</p>;

  // Use page number as unique identifier for all questions
  const questionIdentifier = `question_${page}`;
  const userAnswer = allUserAnswers.find((ans) => ans.question === questionIdentifier);

  const handleClick = (value: string) => {
    addAnswer({ question: questionIdentifier, answer: value });

    if (normalizeAnswer(value) === normalizeAnswer(singleQuestion.correct_answer)) {
      trueAction();
    } else {
      falseAction();
    }

    // For lytting mode, don't auto-advance here - wait for audio to end
    // For lesing mode, advance immediately
    if (!isLytting) {
      nextPage();
      navigate(page === allQuestions.length ? "/finish" : `/question/${category}/${id}/${set}`);
    }
  };

  function renderQuestionComponent() {
    switch (singleQuestion.type) {
      case "image-click":
        if (!singleQuestion.correctArea || !singleQuestion.image) {
          return <p>Error: Missing image or correct area data for image-click question.</p>;
        }

        return (
          <ImageClickAreaQuestion
            question={isLytting ? "" : singleQuestion.question}
            context={isLytting ? "" : singleQuestion.context}
            image={singleQuestion.image || ""}
            correctArea={singleQuestion.correctArea}
            handleClick={(answerString) => {
              const [, , correctness] = answerString.split("|");

              addAnswer({
                question: questionIdentifier,
                answer: answerString, // ✅ store full "x|y|correct"
              });

              correctness === "correct" ? trueAction() : falseAction();

              // Don't auto-advance for either mode
              // Lytting mode waits for audio to end
              // Lesing mode waits for user to click continue button
            }}
            summary={false}
            // difficulty={singleQuestion.difficulty || ""}
            userAnswer={userAnswer?.answer}
            questionId={page}
            showContinueButton={!isLytting}
            onContinue={() => {
              nextPage();
              navigate(page === allQuestions.length ? "/finish" : `/question/${category}/${id}/${set}`);
            }}
          />
        );
      case "image":
        return (
          <ImageQuestion
            question={isLytting ? "" : singleQuestion.question}
            options={singleQuestion.options || []}
            correctAnswer={singleQuestion.correct_answer}
            handleClick={handleClick}
            summary={false}
            imageSrc={singleQuestion.image || null}
            sentence={isLytting ? null : (singleQuestion.sentence || null)}
            // difficulty={singleQuestion.difficulty || ""}
            showFeedback={isLytting}
            userAnswer={userAnswer?.answer}
            questionId={page}
          />
        );
      case "word-selection":
        return (
          <WordSelectionQuestion
            question={isLytting ? "" : singleQuestion.question}
            sentence={singleQuestion.sentence || ""}
            correctWord={singleQuestion.correct_answer}
            handleClick={handleClick}
            summary={false}
            // difficulty={singleQuestion.difficulty || ""}
            showFeedback={isLytting}
            userAnswer={userAnswer?.answer}
            questionId={page}
          />
        );
      case "paragraph-selection":
        return (
          <ParagraphSelectionQuestion
            question={isLytting ? "" : singleQuestion.question}
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
          return <p className="text-danger-600">Feil: Mangler data for sentence-dropdown</p>;
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
                question: questionIdentifier,
                answer: val,
              });

              const selectedAnswers = val
                .split("||")
                .map((entry) => entry.split("|")[1]);

              const isCorrect = selectedAnswers.every(
                (ans, i) => ans === singleQuestion.correct_answer[i]
              );

              isCorrect ? trueAction() : falseAction();

              // For lytting mode, don't auto-advance - wait for audio to end
              // For lesing mode, advance immediately
              if (!isLytting) {
                nextPage();
                navigate(page === allQuestions.length ? "/finish" : `/question/${category}/${id}/${set}`);
              }
            }}

            summary={false}
            // difficulty={singleQuestion.difficulty || ""}
            showFeedback={isLytting}
            questionId={page}
          />
        );

      case "multi_dropdown":
        if (
          !Array.isArray(singleQuestion.options) ||
          !Array.isArray(singleQuestion.subQuestions)
        ) {
          return <p className="text-danger-600">Feil: Mangler data for multi_dropdown</p>;
        }

        return (
          <MultiDropdownQuestion
            question={singleQuestion.question}
            context={singleQuestion.context}
            options={singleQuestion.options}
            subQuestions={singleQuestion.subQuestions as Array<{ label: string; correct_answer: string }>}
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
                question: questionIdentifier,
                answer: val,
              });

              const selectedAnswers = val
                .split("||")
                .map((entry) => entry.split("|")[1]);

              const isCorrect = Array.isArray(singleQuestion.subQuestions) &&
                selectedAnswers.every(
                  (ans, i) => ans === singleQuestion.subQuestions?.[i]?.correct_answer
                );

              isCorrect ? trueAction() : falseAction();


              // For lytting mode, don't auto-advance - wait for audio to end
              // For lesing mode, advance immediately
              if (!isLytting) {
                nextPage();
                navigate(page === allQuestions.length ? "/finish" : `/question/${category}/${id}/${set}`);
              }
            }}
            summary={false}
            // difficulty={singleQuestion.difficulty || ""}
            showFeedback={isLytting}
            questionId={page}
          />
        );

      case "dual_dropdown":
        if (
          !Array.isArray((singleQuestion as any).questions) ||
          !Array.isArray((singleQuestion as any).optionSets) ||
          !Array.isArray(singleQuestion.subQuestions)
        ) {
          return <p className="text-danger-600">Feil: Mangler data for dual_dropdown</p>;
        }

        return (
          <DualDropdownQuestion
            context={singleQuestion.context || ""}
            questions={(singleQuestion as any).questions}
            optionSets={(singleQuestion as any).optionSets}
            subQuestions={singleQuestion.subQuestions as any}
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
                question: questionIdentifier,
                answer: val,
              });

              const selectedAnswers = val
                .split("||")
                .map((entry) => entry.split("|")[1]);

              const isCorrect = Array.isArray(singleQuestion.subQuestions) &&
                selectedAnswers.every((ans, i) => {
                  const personIndex = Math.floor(i / 2);
                  const questionIndex = i % 2;
                  return ans === (singleQuestion.subQuestions as any)?.[personIndex]?.correct_answers?.[questionIndex];
                });

              isCorrect ? trueAction() : falseAction();

              // For lytting mode, don't auto-advance - wait for audio to end
              // For lesing mode, advance immediately
              if (!isLytting) {
                nextPage();
                navigate(page === allQuestions.length ? "/finish" : `/question/${category}/${id}/${set}`);
              }
            }}
            summary={false}
            // difficulty={singleQuestion.difficulty || ""}
            showFeedback={isLytting}
            questionId={page}
          />
        );

      default:
        return (
          <Question
            id={page}
            handleClick={handleClick}
            singleQuestion={{
              ...singleQuestion,
              question: isLytting ? "" : singleQuestion.question,
              context: isLytting ? "" : singleQuestion.context,
            }}
            summary={false}
            trueAnswer={singleQuestion.correct_answer}
            userAnswer={userAnswer?.answer || ""}
            showFeedback={isLytting}
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

  // Navigation handlers for lytting mode
  const handleLyttingPrevious = () => {
    if (page > 1) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      prevPage();
    }
  };

  const handleLyttingNext = () => {
    if (page < allQuestions.length) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      nextPage();
    } else if (page === allQuestions.length) {
      // If on last question, go to finish
      navigate("/finish");
    }
  };

  return (
    <>
      <Header />
      <ScaledContent>
        <AnimateProvider className={`max-w-[65vw] mx-auto ${isLytting ? 'pb-24' : ''}`}>
          {/* ✅ Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mt-6 mb-2">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(page / allQuestions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-700 mb-6">
            Spørsmål {page} av {allQuestions.length}
          </p>

          {/* Instruction banner for lytting mode */}
          {isLytting && singleQuestion.instruction && (
            <div className="bg-primary-50 border-2 border-primary-300 rounded-lg p-4 mb-6 text-center">
              <p
                className="text-lg font-semibold text-primary-800"
                dangerouslySetInnerHTML={{ __html: singleQuestion.instruction }}
              />
            </div>
          )}

          {/* Question Navigator - Hide for lytting mode */}
          {!isLytting && <QuestionNavigator />}

          {/* Navigation Buttons - Hide for lytting mode */}
          {!isLytting && (
            <div className="flex justify-between items-center mb-6 gap-4">
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-500 text-white hover:bg-primary-600"
                  }`}
              >
                ← Forrige
              </button>
              <button
                onClick={handleNext}
                disabled={page === allQuestions.length}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${page === allQuestions.length
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-500 text-white hover:bg-primary-600"
                  }`}
              >
                Neste →
              </button>
            </div>
          )}

          <div className="flex max-w-fit flex-col ml-auto space-x-3 mb-10">
            {/* TimeStamp Component */}
          </div>
          <div key={page}>
            {renderQuestionComponent()}
          </div>

          {/* Audio Progress Bar - Only for lytting mode */}
          {isLytting && (
            <div className="fixed bottom-12 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-primary-500 h-full rounded-full transition-all duration-300 ease-linear"
                      style={{ width: `${audioProgress}%` }}
                    ></div>
                  </div>
                </div>
                {/* Navigation buttons for lytting mode */}
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={handleLyttingPrevious}
                    disabled={page === 1}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${page === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary-500 text-white hover:bg-primary-600"
                      }`}
                  >
                    ← Forrige
                  </button>
                  <span className="text-sm text-gray-600">
                    {page} / {allQuestions.length}
                  </span>
                  <button
                    onClick={handleLyttingNext}
                    className="px-6 py-2 rounded-lg font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all"
                  >
                    {page === allQuestions.length ? "Fullfør" : "Neste →"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimateProvider>
      </ScaledContent>
    </>
  );
}

export default SingleQuestion;

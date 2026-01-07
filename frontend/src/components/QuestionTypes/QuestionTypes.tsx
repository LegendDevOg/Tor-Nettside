import { useState, useRef, useEffect } from "react";
// Image Selection Component
export function ImageQuestion({
  question,
  options,
  correctAnswer,
  handleClick,
  summary,
  imageSrc,
  sentence,
  difficulty,
  showFeedback = false,
  userAnswer,
  questionId,
}: {
  question: string;
  options: string[];
  correctAnswer: string | string[];
  handleClick: (value: string) => void;
  summary: boolean;
  imageSrc?: string | null;
  sentence?: string | null;
  difficulty: string;
  showFeedback?: boolean;
  userAnswer?: string;
  questionId?: number;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(userAnswer || null);

  // Reset selected image when question changes
  useEffect(() => {
    setSelectedImage(userAnswer || null);
  }, [questionId, userAnswer]);

  const handleImageClick = (option: string) => {
    if (!summary) {
      setSelectedImage(option);
      handleClick(option);
    }
  };

  return (
    <div className="flex flex-col items-center text-center w-full px-4">

      <h1 className="text-4xl font-bold text-black-300 mb-6 text-center">
        Klikk på riktig bilde
      </h1>

      <h2 className="text-2xl font-bold text-black-300 mb-8 text-center text-decoration-line: underline">
        {difficulty}
      </h2>

      {(sentence || question) && (
        <div className="border-2 border-gray-300 rounded-xl p-6 bg-white shadow-lg mb-8 max-w-3xl w-full">
          {sentence && <h3 className="text-gray-800 mb-4 text-lg leading-relaxed">{sentence}</h3>}
          {question && <h3 className="text-gray-900 font-bold text-xl">{question}</h3>}
        </div>
      )}


      {imageSrc ? (
        <>
          {/* Main Image - Now placed below the question */}
          <div className="w-64 md:w-80 lg:w-32">
            <img
              src={imageSrc}
              alt="Question Image"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          {/* Options - Now aligned below the image */}
          <div className="grid grid-cols-1 gap-4 mt-6 w-full">
            {options.map((option, index) => (
              <div
                key={index}
                className={`border rounded-lg shadow-md transition-all duration-200 ease-in-out overflow-hidden
                  ${selectedImage === option ? "border-4 border-primary-500" : "border-2 border-gray-200"}
                  ${!summary ? "cursor-pointer hover:shadow-lg" : "cursor-default"}`}
                onClick={() => !summary && handleImageClick(option)}>
                <img
                  src={option}
                  alt={`Option ${index}`}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Default Layout When No Image - 4 images in a row on larger screens */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full px-2">
          {options.map((option, index) => (
            <div key={index} className="relative">
              <img
                src={option}
                alt={`Option ${index}`}
                className={`w-full h-auto object-contain rounded-lg transition-all duration-200 ease-in-out shadow-md
                  ${summary && correctAnswer === option ? "border-4 border-success-500" :
                    selectedImage === option ? "border-4 border-primary-500" : "border-2 border-gray-200"}
                  ${!summary ? "cursor-pointer hover:scale-105 hover:shadow-xl" : "cursor-default"}`}
                onClick={() => !summary && handleImageClick(option)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Feedback after selection */}
      {!summary && showFeedback && selectedImage && (
        <div className="mt-4">
          <p className="text-sm font-medium text-primary-600">✓ Svar registrert</p>
        </div>
      )}
    </div>
  );
}

export function WordSelectionQuestion({
  question,
  sentence,
  correctWord,
  handleClick,
  summary,
  difficulty,
  showFeedback = false,
  userAnswer,
  questionId,
}: {
  question: string;
  sentence: string;
  correctWord: string | string[];
  handleClick: (value: string) => void;
  summary: boolean;
  difficulty: string;
  showFeedback?: boolean;
  userAnswer?: string;
  questionId?: number;
}) {
  const [selectedWord, setSelectedWord] = useState<string | null>(userAnswer || null);

  // Reset selected word when question changes
  useEffect(() => {
    setSelectedWord(userAnswer || null);
  }, [questionId, userAnswer]);

  const handleWordClick = (word: string) => {
    if (!summary) {
      setSelectedWord(word);
      handleClick(word);
    }
  };

  const splitSentenceWithPunctuation = (line: string) => {
    return line.match(/[\p{L}\d]+|[.,!?;:]/gu) || [];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-black-300 mb-6 text-center">
        Klikk på svar
      </h1>

      <h2 className="text-2xl font-bold text-black-300 mb-20 text-center text-decoration-line: underline">
        {difficulty}
      </h2>

      {question && <h3 className="text-gray-900 font-semibold mb-4 text-lg">{question}</h3>}

      <p className="text-lg leading-relaxed whitespace-normal break-words">
        {splitSentenceWithPunctuation(sentence).map((word, index) => {
          const isPunctuation = /[.,!?;:]/.test(word);
          const cleanedWord = word.replace(/[.,!?;:]/g, "");

          return isPunctuation ? (
            <span key={index} className="text-black">{word}</span>
          ) : (
            <span
              key={index}
              className={`whitespace-nowrap transition-transform duration-150 ease-in-out px-[2px] rounded inline-block
                ${summary && correctWord === cleanedWord ? "bg-success-200 font-bold" : ""}
                ${selectedWord === cleanedWord ? "bg-primary-200 font-bold" : ""}
                ${!summary ? "cursor-pointer hover:text-primary-600 hover:scale-110" : "cursor-default"}`}
              onClick={() => !summary && handleWordClick(cleanedWord)}
            >
              {word}
            </span>
          );
        })}
      </p>

      {/* Feedback after selection */}
      {!summary && showFeedback && selectedWord && (
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-primary-600">✓ Svar registrert</p>
        </div>
      )}
    </div>
  );
}







// Paragraph Selection Component
export function ParagraphSelectionQuestion({ question, paragraphs, correctParagraph, handleClick, summary }: {
  question: string;
  paragraphs: string[];
  correctParagraph: string | string[];
  handleClick: (value: string) => void;
  userAnswer?: string;
  summary: boolean;
}) {
  return (
    <div>
      {question && <h3 className="text-gray-800 font-semibold mb-4">{question}</h3>}
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`cursor-pointer p-2 rounded-lg ${summary && correctParagraph === paragraph ? "bg-success-200" : ""}`}
            onClick={() => !summary && handleClick(paragraph)}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}


export function SentenceDropdownQuestion({
  sentenceParts,
  options,
  correctAnswers,
  userAnswer = [],
  handleClick,
  summary,
  difficulty,
  showFeedback = false,
  questionId,
}: {
  sentenceParts: string[]; // contains text with {0}, {1}, etc.
  options: string[][];
  correctAnswers: string[];
  userAnswer?: string[];
  handleClick: (val: string) => void;
  summary: boolean;
  difficulty: string;
  showFeedback?: boolean;
  questionId?: number;
}) {
  const [selected, setSelected] = useState<string[]>(userAnswer);
  const [submitted, setSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelected(userAnswer);
    setSubmitted(false);
  }, [questionId, userAnswer]);

  const onChange = (value: string, index: number) => {
    const updated = [...selected];
    updated[index] = value;
    setSelected(updated);
  };

  const isCompleted = options.every((_, i) => selected[i] && selected[i].trim() !== "");

  const submitAnswer = () => {
    const packed = selected.map((val, i) => `${i}|${val}`).join("||");
    setSubmitted(true);
    handleClick(packed);
  };

  // Join sentenceParts and split into text and placeholders
  const sentence = sentenceParts.join("");
  const sentenceSegments = sentence.split(/(\{\d+\})/g);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-3xl mx-auto text-lg">
      <h1 className="text-4xl font-bold text-black-700 mb-4 text-center">
        Fyll inn ordene
      </h1>

      <h2 className="text-2xl font-bold underline text-center text-primary-700 mb-10">
        {difficulty}
      </h2>

      {/* Sentence renderer */}
      <div className="text-gray-800 text-[1.15rem] leading-relaxed max-w-full">
        <p className="whitespace-pre-wrap">
          {sentenceSegments.map((segment, i) => {
            const match = segment.match(/\{(\d+)\}/);
            if (match) {
              const index = parseInt(match[1]);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    verticalAlign: "baseline",
                    margin: "0 4px",
                  }}
                >
                  <select
                    className={`appearance-none bg-white border border-gray-300 px-2 py-1 text-base rounded-md
                      ${summary
                        ? selected[index] === correctAnswers[index]
                          ? "bg-success-100"
                          : "bg-danger-100"
                        : "hover:border-primary-500"
                      }`}
                    value={selected[index] || ""}
                    onChange={(e) =>
                      !summary && onChange(e.target.value, index)
                    }
                    disabled={summary}
                  >
                    <option value="">Velg…</option>
                    {options[index].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </span>
              );
            } else {
              return <span key={i}>{segment}</span>;
            }
          })}
        </p>
      </div>

      {/* Submit button */}
      {!summary && !submitted && (
        <div className="text-center mt-6">
          <button
            onClick={submitAnswer}
            disabled={!isCompleted}
            className={`px-6 py-2 rounded-full font-semibold text-white text-lg shadow-md transition ${isCompleted
              ? "bg-primary-500 hover:bg-primary-600"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Fortsett
          </button>
        </div>
      )}

      {/* Feedback after submission */}
      {submitted && showFeedback && (
        <div className="text-center mt-6">
          <p className="text-sm font-medium text-primary-600">✓ Svar registrert</p>
        </div>
      )}
    </div>
  );
}

export function ImageClickAreaQuestion({
  question,
  context,
  image,
  correctArea,
  handleClick,
  summary,
  userAnswer,
  questionId,
}: {
  question: string;
  context?: string;
  image: string;
  correctArea: { x: number; y: number; radius: number };
  handleClick: (answerString: string) => void;
  summary: boolean;
  difficulty: string;
  userAnswer?: string;
  questionId?: number;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

  // Update image size when loaded
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
  }, [image]);

  // Parse user answer to show their click and reset when question changes
  useEffect(() => {
    if (userAnswer) {
      const [x, y] = userAnswer.split("|");
      if (x && y) {
        setClickedPosition({ x: parseFloat(x), y: parseFloat(y) });
      }
    } else {
      setClickedPosition(null);
    }
  }, [questionId, userAnswer]);

  const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (summary || !imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const scaleX = imgRef.current.naturalWidth / rect.width;
    const scaleY = imgRef.current.naturalHeight / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    console.log(`Clicked at: x=${Math.round(clickX)}, y=${Math.round(clickY)}`);

    const dx = clickX - correctArea.x;
    const dy = clickY - correctArea.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const correct = distance <= correctArea.radius;

    // Show the click immediately
    setClickedPosition({ x: clickX, y: clickY });

    // Lagre som "x|y|correct/wrong"
    handleClick(`${Math.round(clickX)}|${Math.round(clickY)}|${correct ? "correct" : "wrong"}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {question && <h3 className="text-lg font-semibold text-center">{question}</h3>}
      {context && <p className="text-sm text-gray-500 text-center">{context}</p>}
      <div className="relative w-full max-w-xl">
        <img
          ref={imgRef}
          src={image.startsWith('/') ? image : `/images/${image}`}
          onClick={onImageClick}
          className="w-full h-auto object-contain rounded-lg cursor-pointer"
          alt="question"
        />

        {/* Show user's click with an X marker */}
        {clickedPosition && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: `${(clickedPosition.y / imageSize.height) * 100}%`,
              left: `${(clickedPosition.x / imageSize.width) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="14" fill="rgba(0, 0, 0, 0.3)" stroke="#000000" strokeWidth="2" />
              <line x1="8" y1="8" x2="22" y2="22" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
              <line x1="22" y1="8" x2="8" y2="22" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {!summary && !clickedPosition && question && (
        <p className="text-xs text-gray-500 text-center">Klikk på riktig person i bildet.</p>
      )}
      {!summary && clickedPosition && (
        <p className="text-sm font-medium text-primary-600 text-center">✓ Svar registrert</p>
      )}
    </div>
  );
}

export function MultiDropdownQuestion({
  question,
  context,
  options,
  subQuestions,
  userAnswer = [],
  handleClick,
  summary,
  difficulty,
  showFeedback = false,
  questionId,
}: {
  question: string;
  context?: string;
  options: string[];
  subQuestions: Array<{ label: string; correct_answer: string }>;
  userAnswer?: string[];
  handleClick: (val: string) => void;
  summary: boolean;
  difficulty: string;
  showFeedback?: boolean;
  questionId?: number;
}) {
  const [selected, setSelected] = useState<string[]>(userAnswer);
  const [submitted, setSubmitted] = useState(false);

  // Reset state only when question changes, not when userAnswer updates
  useEffect(() => {
    setSelected(userAnswer);
    setSubmitted(false);
  }, [questionId]);

  const onChange = (value: string, index: number) => {
    const updated = [...selected];
    updated[index] = value;
    setSelected(updated);

    // Always save the answer on every change
    const packed = updated.map((val, i) => `${i}|${val || ""}`).join("||");
    handleClick(packed);

    // Check if this completes all dropdowns
    const isCompleted = subQuestions.every((_, i) => {
      if (i === index) return value && value.trim() !== "";
      return updated[i] && updated[i].trim() !== "";
    });

    // Mark as submitted when all dropdowns are filled
    if (isCompleted && !submitted && !summary) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-black-700 mb-4 text-center">
        {question}
      </h1>

      <h2 className="text-2xl font-bold underline text-center text-primary-700 mb-6">
        {difficulty}
      </h2>

      {context && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <p className="text-gray-700 text-base leading-relaxed italic">{context}</p>
        </div>
      )}

      <div className="space-y-6">
        {subQuestions.map((subQ, index) => (
          <div key={index} className="flex items-center gap-4">
            <label className="text-lg font-semibold text-gray-800 min-w-[120px]">
              {subQ.label}
            </label>
            <select
              className={`flex-1 appearance-none bg-white border-2 px-4 py-3 text-base rounded-lg shadow-sm transition-all
                ${summary
                  ? selected[index] === subQ.correct_answer
                    ? "bg-success-100 border-success-500"
                    : "bg-danger-100 border-danger-500"
                  : "border-gray-300 hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                }`}
              value={selected[index] || ""}
              onChange={(e) => !summary && onChange(e.target.value, index)}
              disabled={summary}
            >
              <option value="">Velg…</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Feedback after submission */}
      {submitted && showFeedback && (
        <div className="text-center mt-8">
          <p className="text-sm font-medium text-primary-600">✓ Svar registrert</p>
        </div>
      )}
    </div>
  );
}

export function DualDropdownQuestion({
  context,
  questions,
  optionSets,
  subQuestions,
  userAnswer = [],
  handleClick,
  summary,
  difficulty,
  showFeedback = false,
  questionId,
}: {
  context: string;
  questions: [string, string];
  optionSets: [string[], string[]];
  subQuestions: Array<{ label: string; correct_answers: [string, string] }>;
  userAnswer?: string[];
  handleClick: (val: string) => void;
  summary: boolean;
  difficulty: string;
  showFeedback?: boolean;
  questionId?: number;
}) {
  const [selected, setSelected] = useState<string[]>(userAnswer);
  const [submitted, setSubmitted] = useState(false);

  // Reset state only when question changes, not when userAnswer updates
  useEffect(() => {
    setSelected(userAnswer);
    setSubmitted(false);
  }, [questionId]);

  const onChange = (value: string, personIndex: number, questionIndex: number) => {
    const updated = [...selected];
    const flatIndex = personIndex * 2 + questionIndex;
    updated[flatIndex] = value;
    setSelected(updated);

    // Always save the answer on every change
    const packed = updated.map((val, i) => `${i}|${val || ""}`).join("||");
    handleClick(packed);

    // Check if this completes all dropdowns
    const isCompleted = subQuestions.every((_, i) =>
      updated[i * 2] && updated[i * 2].trim() !== "" &&
      updated[i * 2 + 1] && updated[i * 2 + 1].trim() !== ""
    );

    // Mark as submitted when all dropdowns are filled
    if (isCompleted && !submitted && !summary) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold underline text-center text-primary-700 mb-6">
        {difficulty}
      </h2>

      {context && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <p className="text-gray-700 text-base leading-relaxed italic">{context}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="p-4 text-left font-semibold text-gray-800"></th>
              <th className="p-4 text-center font-semibold text-gray-800 min-w-[250px]">{questions[0]}</th>
              <th className="p-4 text-center font-semibold text-gray-800 min-w-[250px]">{questions[1]}</th>
            </tr>
          </thead>
          <tbody>
            {subQuestions.map((subQ, personIndex) => (
              <tr key={personIndex} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-semibold text-gray-800">{subQ.label}</td>
                <td className="p-4">
                  <select
                    className={`w-full appearance-none bg-white border-2 px-4 py-3 text-base rounded-lg shadow-sm transition-all
                      ${summary
                        ? selected[personIndex * 2] === subQ.correct_answers[0]
                          ? "bg-success-100 border-success-500"
                          : "bg-danger-100 border-danger-500"
                        : "border-gray-300 hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      }`}
                    value={selected[personIndex * 2] || ""}
                    onChange={(e) => !summary && onChange(e.target.value, personIndex, 0)}
                    disabled={summary}
                  >
                    <option value="">Velg…</option>
                    {optionSets[0].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <select
                    className={`w-full appearance-none bg-white border-2 px-4 py-3 text-base rounded-lg shadow-sm transition-all
                      ${summary
                        ? selected[personIndex * 2 + 1] === subQ.correct_answers[1]
                          ? "bg-success-100 border-success-500"
                          : "bg-danger-100 border-danger-500"
                        : "border-gray-300 hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      }`}
                    value={selected[personIndex * 2 + 1] || ""}
                    onChange={(e) => !summary && onChange(e.target.value, personIndex, 1)}
                    disabled={summary}
                  >
                    <option value="">Velg…</option>
                    {optionSets[1].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feedback after submission */}
      {submitted && showFeedback && (
        <div className="text-center mt-8">
          <p className="text-sm font-medium text-primary-600">✓ Svar registrert</p>
        </div>
      )}
    </div>
  );
}





// Update options handling with TypeScript
export function getOptions(singleQuestion: { type: string; incorrect_answers?: string[]; correct_answer?: string }): string[] {
  let options: string[] = [];
  if (singleQuestion.type === "multiple" && singleQuestion.incorrect_answers && singleQuestion.correct_answer) {
    options = [...singleQuestion.incorrect_answers, singleQuestion.correct_answer].sort(() => Math.random() - 0.5);
  }
  return options;
}

export default {
  ImageQuestion,
  WordSelectionQuestion,
  ParagraphSelectionQuestion,
  SentenceDropdownQuestion,
  MultiDropdownQuestion,
  DualDropdownQuestion,
  getOptions
};
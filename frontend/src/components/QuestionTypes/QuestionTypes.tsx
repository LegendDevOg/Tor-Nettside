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
  difficulty
}: {
  question: string;
  options: string[];
  correctAnswer:  string | string[];
  handleClick: (value: string) => void;
  summary: boolean;
  imageSrc?: string | null;
  sentence?: string | null;
  difficulty: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">

      <h1 className="text-4xl font-bold text-black-300 mb-6 text-center">
        Klikk på riktig bilde
      </h1>
      
      <h2 className="text-2xl font-bold text-black-300 mb-20 text-center text-decoration-line: underline">
        {difficulty}
      </h2>

      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
  <h3 className="text-gray-800 mb-10 text-lg">{sentence}</h3>
  <h3 className="text-gray-800 font-bold mb-4 text-lg">{question}</h3>

</div>


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
                className="cursor-pointer border rounded-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg overflow-hidden"
                onClick={() => !summary && handleClick(option)}>
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
        /* Default Layout When No Image */
        <div className="flex flex-wrap justify-center gap-6">
          {options.map((option, index) => (
            <div key={index} className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
              <img
                src={option}
                alt={`Option ${index}`}
                className={`w-full h-full max-w-full max-h-full object-contain rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                  ${summary && correctAnswer === option ? "border-4 border-green-500" : ""}
                  hover:scale-110 hover:shadow-lg`}
                onClick={() => !summary && handleClick(option)}
              />
            </div>
          ))}
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
  difficulty
}: {
  question: string;
  sentence: string;
  correctWord:  string | string[];
  handleClick: (value: string) => void;
  summary: boolean;
  difficulty: string;
}) {
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

      <h3 className="text-gray-900 font-semibold mb-4 text-lg">{question}</h3>

      <p className="text-lg leading-relaxed whitespace-normal break-words">
        {splitSentenceWithPunctuation(sentence).map((word, index) => {
          const isPunctuation = /[.,!?;:]/.test(word);
          const cleanedWord = word.replace(/[.,!?;:]/g, "");

          return isPunctuation ? (
            <span key={index} className="text-black">{word}</span>
          ) : (
            <span
              key={index}
              className={`whitespace-nowrap cursor-pointer transition-transform duration-150 ease-in-out px-[2px] rounded inline-block
                ${summary && correctWord === cleanedWord ? "bg-green-300 font-bold" : ""}
                hover:text-blue-600 hover:scale-110`}
              onClick={() => !summary && handleClick(cleanedWord)}
            >
              {word}
            </span>
          );
        })}
      </p>
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
      <h3 className="text-gray-800 font-semibold mb-4">{question}</h3>
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`cursor-pointer p-2 rounded-lg ${summary && correctParagraph === paragraph ? "bg-green-300" : ""}`}
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
}: {
  sentenceParts: string[]; // contains text with {0}, {1}, etc.
  options: string[][];
  correctAnswers: string[];
  userAnswer?: string[];
  handleClick: (val: string) => void;
  summary: boolean;
  difficulty: string;
}) {
  const [selected, setSelected] = useState<string[]>(userAnswer);

  const onChange = (value: string, index: number) => {
    const updated = [...selected];
    updated[index] = value;
    setSelected(updated);
  };

const isCompleted = options.every((_, i) => selected[i] && selected[i].trim() !== "");

  const submitAnswer = () => {
    const packed = selected.map((val, i) => `${i}|${val}`).join("||");
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

      <h2 className="text-2xl font-bold underline text-center text-blue-700 mb-10">
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
                      ${
                        summary
                          ? selected[index] === correctAnswers[index]
                            ? "bg-green-200"
                            : "bg-red-200"
                          : "hover:border-blue-500"
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
      {!summary && (
        <div className="text-center mt-6">
          <button
            onClick={submitAnswer}
            disabled={!isCompleted}
            className={`px-6 py-2 rounded-full font-semibold text-white text-lg shadow-md transition ${
              isCompleted
                ? "bg-blue-500 hover:bg-blue-400"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Fortsett
          </button>
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
}: {
  question: string;
  context?: string;
  image: string;
  correctArea: { x: number; y: number; radius: number };
  handleClick: (answerString: string) => void;
  summary: boolean;
  difficulty: string;
}) {
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

    // Lagre som "x|y|correct/wrong"
    handleClick(`${Math.round(clickX)}|${Math.round(clickY)}|${correct ? "correct" : "wrong"}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold text-center">{question}</h3>
      {context && <p className="text-sm text-gray-500 text-center">{context}</p>}
      <div className="relative w-full max-w-xl">
        <img
          ref={imgRef}
          src={`/images/${image}`}
          onClick={onImageClick}
          className="w-full h-auto object-contain rounded-lg cursor-pointer"
          alt="question"
        />

        {/* ✅ Utvikler-sirkel som viser riktig klikkeområde */}
        {!summary && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              top: `${(correctArea.y / imageSize.height) * 100}%`,
              left: `${(correctArea.x / imageSize.width) * 100}%`,
              width: `${(correctArea.radius * 2 / imageSize.width) * 100}%`,
              height: `${(correctArea.radius * 2 / imageSize.height) * 100}%`,
            }}
          />
        )}
      </div>

      {!summary && (
        <p className="text-xs text-gray-500 text-center">Klikk på riktig person i bildet.</p>
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
  getOptions
};

// Image Selection Component
export function ImageQuestion({
  question,
  options,
  correctAnswer,
  handleClick,
  summary
}: {
  question: string;
  options: string[];
  correctAnswer: string;
  handleClick: (value: string) => void;
  summary: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-gray-800 font-semibold mb-6 text-lg text-center">{question}</h3>
      <div className="flex flex-wrap justify-center gap-6">
        {options.map((option, index) => (
          <img
            key={index}
            src={option}
            alt={`Option ${index}`}
            className={`w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
              ${summary && correctAnswer === option ? "border-4 border-green-500" : ""}
              hover:scale-110 hover:shadow-lg`}
            onClick={() => !summary && handleClick(option)}
          />
        ))}
      </div>
    </div>
  );
}

export function WordSelectionQuestion({
  question,
  sentence,
  correctWord,
  handleClick,
  summary,
}: {
  question: string;
  sentence: string;
  correctWord: string;
  handleClick: (value: string) => void;
  summary: boolean;
}) {
  const splitSentenceWithPunctuation = (sentence: string) => {
    return sentence.match(/[\p{L}\d]+|[.,!?;:]/gu) || []; 
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto">
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
              className={`cursor-pointer transition-transform duration-150 ease-in-out px-[2px] rounded inline
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
  correctParagraph: string;
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

// Update options handling with TypeScript
export function getOptions(singleQuestion: { type: string; incorrect_answers?: string[]; correct_answer?: string }): string[] {
  let options: string[] = [];
  if (singleQuestion.type === "multiple" && singleQuestion.incorrect_answers && singleQuestion.correct_answer) {
    options = [...singleQuestion.incorrect_answers, singleQuestion.correct_answer].sort(() => Math.random() - 0.5);
  }
  return options;
}

export default { ImageQuestion, WordSelectionQuestion, ParagraphSelectionQuestion, getOptions };

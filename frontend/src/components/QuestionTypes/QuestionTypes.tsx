
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
  correctAnswer: string;
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
  correctWord: string;
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

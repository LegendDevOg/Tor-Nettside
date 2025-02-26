import React from "react";

// Image Selection Component
export function ImageQuestion({ question, options, correctAnswer, handleClick, userAnswer, summary }: {
  question: string;
  options: string[];
  correctAnswer: string;
  handleClick: (value: string) => void;
  userAnswer?: string;
  summary: boolean;
}) {
  return (
    <div>
      <h3 className="text-gray-800 font-semibold mb-4">{question}</h3>
      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <img
            key={index}
            src={option}
            alt={`Option ${index}`}
            className={`w-32 h-32 rounded-lg cursor-pointer ${summary && correctAnswer === option ? "border-4 border-green-500" : ""}`}
            onClick={() => !summary && handleClick(option)}
          />
        ))}
      </div>
    </div>
  );
}

// Word Selection in Sentence Component
export function WordSelectionQuestion({ question, sentence, correctWord, handleClick, userAnswer, summary }: {
  question: string;
  sentence: string;
  correctWord: string;
  handleClick: (value: string) => void;
  userAnswer?: string;
  summary: boolean;
}) {
  return (
    <div>
      <h3 className="text-gray-800 font-semibold mb-4">{question}</h3>
      <p className="text-lg">
        {sentence.split(" ").map((word, index) => (
          <span
            key={index}
            className={`cursor-pointer px-2 ${summary && correctWord === word ? "bg-green-300" : ""}`}
            onClick={() => !summary && handleClick(word)}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}

// Paragraph Selection Component
export function ParagraphSelectionQuestion({ question, paragraphs, correctParagraph, handleClick, userAnswer, summary }: {
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

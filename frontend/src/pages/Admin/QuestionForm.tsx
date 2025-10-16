import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Question from "../../components/Questions/Questions";
import { ImageQuestion, WordSelectionQuestion } from "../../components/QuestionTypes/QuestionTypes";

type QuestionType = "multiple" | "image" | "word-selection";

interface QuestionData {
    type: QuestionType;
    question: string;
    correct_answer: string;
    incorrect_answers?: string[];
    options?: string[];
    sentence?: string;
    paragraphs?: string[];
    image?: string | null;
    difficulty?: string;
    context?: string;
  }

  const defaultQuestion: QuestionData = {
    type: "multiple",
    question: "",
    correct_answer: "",
    incorrect_answers: [""],
    options: [],
    sentence: "",
    paragraphs: [],
    image: null,
    difficulty: "A1-A2",
    context: ""
  };
const QuestionForm = () => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [current, setCurrent] = useState<QuestionData>({ ...defaultQuestion });
  const [category] = useState("A1");

  const addQuestion = () => {
    let q = { ...current };

    if (q.type === "multiple") {
      q.options = [q.correct_answer, ...(q.incorrect_answers || [])];
    }

    setQuestions([...questions, q]);
    setCurrent({ ...defaultQuestion });
  };

  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${category}-Set-${uuidv4().slice(0, 6)}.json`;
    a.click();
  };

  const renderPreview = () => {
    const dummyClick = () => {};

    if (!current) return null;

    switch (current.type) {
      case "image":
        return (
          <ImageQuestion
            question={current.question || ""}
            options={current.options || []}
            correctAnswer={current.correct_answer}
            handleClick={dummyClick}
            summary={false}
            imageSrc={current.image || null}
            sentence={current.sentence || ""}
            difficulty={current.difficulty || ""}
          />
        );
      case "word-selection":
        return (
          <WordSelectionQuestion
            question={current.question || ""}
            sentence={current.sentence || ""}
            correctWord={current.correct_answer}
            handleClick={dummyClick}
            summary={false}
            difficulty={current.difficulty || ""}
          />
        );
      default:
        return (
          <Question
            id={0}
            handleClick={dummyClick}
            singleQuestion={current}
            summary={false}
            trueAnswer={current.correct_answer}
            userAnswer=""
          />
        );
    }
  };

  return (
    <div className="flex gap-10 flex-wrap items-start">
      {/* Form */}
      <div className="w-full lg:w-1/2 space-y-4">
        <h2 className="text-2xl font-bold">🛠️ Lag ny spørsmål</h2>

        <select
          value={current.type}
          onChange={(e) => setCurrent({ ...current, type: e.target.value as QuestionType })}
          className="w-full border p-2 rounded"
        >
          <option value="multiple">Multiple Choice</option>
          <option value="image">Image Question</option>
          <option value="word-selection">Word Selection</option>
        </select>

        {current.type !== "image" && (
          <input
            type="text"
            placeholder="Spørsmål"
            value={current.question}
            onChange={(e) => setCurrent({ ...current, question: e.target.value })}
            className="w-full border p-2 rounded"
          />
        )}

        {current.type === "multiple" && (
          <>
            <input
              type="text"
              placeholder="Riktig svar"
              value={current.correct_answer}
              onChange={(e) => setCurrent({ ...current, correct_answer: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="Feil svar (kommaseparert)"
              value={current.incorrect_answers?.join(",") || ""}
              onChange={(e) =>
                setCurrent({ ...current, incorrect_answers: e.target.value.split(",") })
              }
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {current.type === "word-selection" && (
          <textarea
            placeholder="Settning"
            value={current.sentence}
            onChange={(e) => setCurrent({ ...current, sentence: e.target.value })}
            className="w-full border p-2 rounded"
          />
        )}

        {current.type === "image" && (
          <>
            <label className="text-sm">Velg bilde fra maskinen (lagres ikke automatisk)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const path = `/images/${file.name}`;
                  setCurrent({
                    ...current,
                    correct_answer: path,
                    options: [path],
                    image: path,
                  });
                }
              }}
              className="w-full"
            />
            {current.image && (
              <img src={current.image} alt="Preview" className="mt-2 max-h-40 rounded shadow" />
            )}
            <p className="text-xs text-danger-500 mt-2">
              ⚠️ Husk å manuelt legge bildet i <code>/public/images/</code>!
            </p>
          </>
        )}

        <button
          onClick={addQuestion}
          className="bg-success-600 hover:bg-success-500 text-white px-4 py-2 rounded"
        >
          ➕ Legg til spørsmål
        </button>

        <button
          onClick={saveToFile}
          className="ml-4 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded"
        >
          💾 Lagre JSON
        </button>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-1/2">
        <h3 className="text-xl font-semibold mb-2">📺 Live Preview</h3>
        <div className="p-4 bg-white border shadow rounded space-y-2">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;

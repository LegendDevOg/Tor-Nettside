import { create } from "zustand";
import { persist } from "zustand/middleware";

type Question = {
  type:
    | "multiple"
    | "image"
    | "word-selection"
    | "paragraph-selection"
    | "sentence-dropdown"
    | "image-click";

  context?: string;
  question: string;
  correct_answer: string | string[]; // ✅ string[] for sentence-dropdown
  incorrect_answers?: string[];
  options?: string[];
  sentence?: string;
  paragraphs?: string[];
  sentenceParts?: string[]; // ✅ for sentence-dropdown
  dropdownOptions?: string[][]; // ✅ for sentence-dropdown
  category?: string;
  difficulty?: string;
  image?: string | "";
  correctArea?: { x: number; y: number; radius: number };
};

type UserAnswer = {
  question: string;
  answer: string;
};

type Auth = Record<string, any>;

type QuestionStoreState = {
  question: Question[];
  userAnswer: UserAnswer[];
  error: Error | null;
  totalTime: number;
  trueAnswer: number;
  falseAnswer: number;
  auth: Auth;
  page: number;
  fetchQuestion: (query: string) => Promise<void>;
  authUser: (auth: Auth) => void;
  addAnswer: (answer: UserAnswer) => void;
  trueAction: () => void;
  falseAction: () => void;
  logoutUser: () => void;
  resetQuestion: () => void;
  setTimeStamp: (time: number) => void;
  nextPage: () => void;
  resetStore: () => void;
};


  
const useQuestionStore = create<QuestionStoreState>()(
  persist(
    (set) => ({
      question: [],
      userAnswer: [],
      error: null,
      totalTime: 0,
      trueAnswer: 0,
      falseAnswer: 0,
      auth: {},
      page: 1,
      resetStore: () =>
        set({
          question: [],
          error: null,
          trueAnswer: 0,
          falseAnswer: 0,
          page: 1,
        }),
fetchQuestion: async (query: string) => {
  try {
    console.log(`🚀 Fetching questions from /${query}.json...`);
    const response = await fetch(`/${query}.json`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("❌ Error: JSON data is not an array!", data);
      return;
    }

    set(() => ({
      question: [...data],
      error: null,
      page: 1, // ✅ Reset page!
    }));
    console.log("✅ Questions stored in Zustand successfully!");
  } catch (error) {
    console.warn("❌ Error fetching questions:", error);
    set({ error: error as Error });
  }
},
      authUser: (auth) => set((state) => ({ ...state, auth })),
      addAnswer: (answer) =>
        set((state) => {
          const existingIndex = state.userAnswer.findIndex(
            (a) => a.question === answer.question
          );
          if (existingIndex !== -1) {
            const updatedAnswers = [...state.userAnswer];
            updatedAnswers[existingIndex] = answer;
            return { ...state, userAnswer: updatedAnswers };
          }
          return { ...state, userAnswer: [...state.userAnswer, answer] };
        }),      
      trueAction: () =>
        set((state) => ({ ...state, trueAnswer: state.trueAnswer + 1 })),
      falseAction: () =>
        set((state) => ({ ...state, falseAnswer: state.falseAnswer + 1 })),
      logoutUser: () =>
        set({
          question: [],
          userAnswer: [],
          error: null,
          totalTime: 0,
          trueAnswer: 0,
          falseAnswer: 0,
          auth: {},
          page: 1,
        }),
      resetQuestion: () =>
        set((state) => ({
          ...state,
          question: [],
          trueAnswer: 0,
          falseAnswer: 0,
          error: null,
          page: 1,
        })),
      setTimeStamp: (time) =>
        set((state) => ({
          ...state,
          totalTime: time,
        })),
      nextPage: () =>
        set((state) => ({
          ...state,
          page: state.page + 1,
        })),
    }),
    {
      name: "question-storage",
    }
  )
);

export default useQuestionStore;
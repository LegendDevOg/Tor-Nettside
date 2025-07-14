import { useNavigate, useParams } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import viteLogo from './../../assets/logo.svg';

import useQuestionStore from "../../data/GetData"; // eller riktig path

function Sett() {
  const navigate = useNavigate();
  const { id } = useParams();
  const resetStore = useQuestionStore((state) => state.resetStore); // ✅ hent funksjonen

  const handleStart = (setId: string) => {
    resetStore(); // 🔄 nullstill lagret state før du navigerer
    navigate(`/question/${id}/${setId}`);
  };

  return (
    <AnimateProvider className="">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-orange-100 p-4">
        <div className="mb-6">
          <img src={viteLogo} className="h-40 w-auto mx-auto" alt="Logo" />
        </div>

        <h1 className="text-6xl font-bold text-black-600 mb-16 text-center">
          {id === "lytting" ? "Lytteprøven" : "Leseprøven"}
        </h1>

        <div className="flex space-x-12 w-full max-w-sm">
          <button
            onClick={() => handleStart("Sett-1")}
            className="rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition"
          >
            Sett 1
          </button>

          <button
            onClick={() => handleStart("Sett-2")}
            className="rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition"
          >
            Sett 2
          </button>

          <button
            onClick={() => handleStart("Sett-3")}
            className="rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition"
          >
            Sett 3
          </button>
        </div>
      </div>
    </AnimateProvider>
  );
}

export default Sett;

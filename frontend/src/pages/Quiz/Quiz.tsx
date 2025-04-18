import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import useQuestionStore from "../../data/GetData";
import viteLogo from './../../assets/logo.svg';


function Quiz() {
  const { fetchQuestion, resetStore,  question: questionData } = useQuestionStore();
  const { search } = useLocation();
  const navigate = useNavigate();
  

  const handleBegin = (_category: string) => {
    // ✅ Ensure correct query format
    navigate(`/sett/` + _category);
  };
  
  useEffect(() => {
      resetStore();
      fetchQuestion(search);
    }, [search]);
  
    if (!questionData.length) return <p>Loading...</p>;
  return (
    <AnimateProvider className="">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-orange-100 p-4">
      {/* Logo Section */}
      <div className="mb-6">
        <img src={viteLogo} className="h-40 w-auto mx-auto" alt="Tor logo" />
      </div>

      {/* Title Section */}
      <h1 className="text-6xl font-bold text-black-600 mb-16 text-center">
        Leseprøven <span className="text-gray-800"></span>
      </h1>


      {/* Buttons Section */}
      <div className="flex space-x-12 w-full max-w-sm">
      <button
          onClick={() => handleBegin("1")}
          className="flex-shrink-0 rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
        Sett 1
      </button>

      <button
          onClick={() => handleBegin("2")}
        className="flex-shrink-0 rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
        Sett 2
      </button>

      <button
          onClick={() => handleBegin("3")}
        className="flex-shrink-0 rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
        Sett 3
      </button>
      </div>
    </div>
    </AnimateProvider>
  );
}

export default Quiz;

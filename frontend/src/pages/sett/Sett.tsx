import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import useQuestionStore from "../../data/GetData";
import viteLogo from './../../assets/logo.svg';


function Sett() {
  const { fetchQuestion, resetStore,  question: questionData } = useQuestionStore();
  const { search } = useLocation();
  const navigate = useNavigate();
  
  const { id } = useParams();


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
        Sett {id}<span className="text-gray-800"></span>
      </h1>

      {/* Buttons Section */}
      <div className="flex space-x-12 w-full max-w-sm">
      <button
        onClick={() => {
            navigate(`/question/1`);
        }}
        className="flex-shrink-0 rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
        A1-A2
      </button>

      <button
        className="flex-shrink-0 rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
        A2-B1
      </button>

      <button
        className="flex-shrink-0 rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
        B1-B2
      </button>
      </div>
    </div>
    </AnimateProvider>
  );
}

export default Sett;

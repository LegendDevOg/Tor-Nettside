import viteLogo from './assets/logo.svg';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleBegin = (_category: string) => {
    // Navigate to the Quiz page first, then they will choose difficulty there
    navigate(`/question`, { replace: false }); // Navigating to /question for quiz
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-orange-100 p-4">
      {/* Logo Section */}
      <div className="mb-6">
        <img src={viteLogo} className="h-40 w-auto mx-auto" alt="Tor logo" />
      </div>

      {/* Title Section */}
      <h1 className="text-5xl font-bold text-black-600 mb-16 text-center">
        Norskprøven <span className="text-gray-800"></span>
      </h1>

      {/* Buttons Section */}
      <div className="flex space-x-12 w-full max-w-sm">
        <button
          onClick={() => handleBegin("lesing")}  // Navigate to quiz for Leseprøven
          className="w-full flex items-center justify-center rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
          Leseprøven
        </button>

        <button
          onClick={() => handleBegin("lytting")}  // Navigate to quiz for Lytteprøven
          className="w-full flex items-center justify-center rounded-full bg-blue-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-blue-400 transition">
          Lytteprøven
        </button>
      </div>
    </div>
  );
}

export default App;

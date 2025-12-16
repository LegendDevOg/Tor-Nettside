import viteLogo from './assets/logo.svg';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleBegin = (category: string) => {
    // Navigate to the Quiz page with category (lesing or lytting)
    navigate(`/question/${category}`, { replace: false });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      {/* Logo Section */}
      <div className="mb-6">
        <img src={viteLogo} className="h-40 w-auto mx-auto" alt="Tor logo" />
      </div>

      {/* Title Section */}
      <h1 className="text-5xl font-bold text-gray-800 mb-16 text-center">
        Norskprøven
      </h1>

      {/* Buttons Section */}
      <div className="flex space-x-12 w-full max-w-sm">
        <button
          onClick={() => handleBegin("lesing")}  // Navigate to quiz for Leseprøven
          className="w-full flex items-center justify-center rounded-full bg-primary-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-primary-600 transition">
          Leseprøven
        </button>

        <button
          onClick={() => handleBegin("lytting")}  // Navigate to quiz for Lytteprøven
          className="w-full flex items-center justify-center rounded-full bg-primary-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-primary-600 transition">
          Lytteprøven
        </button>
      </div>
    </div>
  );
}

export default App;

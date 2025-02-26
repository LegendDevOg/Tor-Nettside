import viteLogo from './assets/LOGO.png';
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleBegin = (category: string) => {
    // ✅ Ensure correct query format
    navigate(`/question?1
      `, { replace: false });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-orange-100 p-4">
      {/* Logo Section */}
      <div className="mb-6">
        <a href="https://www.norwegianwithtor.com/" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="h-80 w-auto mx-auto" alt="Tor logo" />
        </a>
      </div>

      {/* Title Section */}
      <h1 className="text-3xl font-bold text-orange-600 mb-4 text-center">
        Norsk Prøve <span className="text-gray-800">(A1-B2)</span>
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Velg en kategori for å begynne testen.
      </p>

      {/* Buttons Section */}
      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={() => handleBegin("lytting")}
          className="w-full flex items-center justify-center rounded-full bg-orange-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-orange-400 transition">
          Sett 1 (Lytting)
        </button>
        <button
          onClick={() => handleBegin("lesing")}
          className="w-full flex items-center justify-center rounded-full bg-orange-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-orange-400 transition">
          Sett 1 (Lesing)
        </button>
      </div>
    </div>
  );
}

export default App;

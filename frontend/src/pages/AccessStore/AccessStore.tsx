import { useState } from "react";
import useAccessStore from "../../data/AccessStore";
import { useNavigate } from "react-router-dom";

const AccessCodeScreen = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const setAccess = useAccessStore((state) => state.setAccess);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (code.trim() === "HQWX4Y") { // Replace with your validation logic
      setAccess(true); // Grant access
      navigate("/"); // Redirect to the main app
    } else {
      setError("Invalid access code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-orange-100 p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Enter Access Code</h1>
      <div className="w-full max-w-sm space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your access code"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full rounded-full bg-orange-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-orange-400 transition">
          Submit
        </button>
      </div>
    </div>
  );
};

export default AccessCodeScreen;

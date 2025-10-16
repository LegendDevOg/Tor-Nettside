import { useState } from "react";
import useAccessStore from "../../data/AccessStore";
import { useNavigate } from "react-router-dom";

const AccessCodeScreen = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const setAccess = useAccessStore((state) => state.setAccess);
  const navigate = useNavigate();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent default form behavior (reload)
    if (code.trim() === "123") {
      setAccess(true);
      navigate("/");
    } else {
      setError("Invalid access code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Enter Access Code</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4"
      >
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your access code"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        {error && <p className="text-danger-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-primary-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-primary-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AccessCodeScreen;

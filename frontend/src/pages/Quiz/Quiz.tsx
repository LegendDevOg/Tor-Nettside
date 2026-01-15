import { useNavigate, useParams } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import viteLogo from './../../assets/logo.svg';
import Header from "../../components/Header/Header";
import ScaledContent from "../../components/ScaledContent/ScaledContent";

function Quiz() {
  const navigate = useNavigate();
  const { category } = useParams(); // Get category from URL (lesing or lytting)

  const handleBegin = (difficulty: string) => {
    // Navigate to the set selection page with category and difficulty
    navigate(`/vannskelig/${category}/${difficulty}`, { replace: false });
  };

  return (
    <>
      <Header />
      <ScaledContent>
        <AnimateProvider className="">
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Logo Section */}
            <div className="mb-6">
              <img src={viteLogo} className="h-40 w-auto mx-auto" alt="Tor logo" />
            </div>

            {/* Title Section */}
            <h1 className="text-6xl font-bold text-black-600 mb-16 text-center">
              {category === "lytting" ? "Lytteprøven" : "Leseprøven"} <span className="text-gray-800"></span>
            </h1>

            {/* Buttons Section */}
            <div className="flex space-x-12 w-full max-w-sm">
              <button
                onClick={() => handleBegin("A1")}  // Navigate to /vannskelig/A1
                className="w-full flex items-center justify-center rounded-full bg-primary-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-primary-600 transition whitespace-nowrap">
                A1-A2
              </button>

              <button
                onClick={() => handleBegin("A2")}  // Navigate to /vannskelig/A2
                className="w-full flex items-center justify-center rounded-full bg-primary-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-primary-600 transition whitespace-nowrap">
                A2-B1
              </button>

              <button
                onClick={() => handleBegin("B1")}  // Navigate to /vannskelig/B1
                className="w-full flex items-center justify-center rounded-full bg-primary-500 py-3 px-6 font-semibold text-white text-lg shadow-lg hover:bg-primary-600 transition whitespace-nowrap">
                B1-B2
              </button>
            </div>
          </div>
        </AnimateProvider>
      </ScaledContent>
    </>
  );
}

export default Quiz;

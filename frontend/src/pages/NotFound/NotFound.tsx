import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <h1 className="text-[8rem] font-bold animate-bounce text-danger-500">404</h1>
      <div className="w-24 h-1 md:w-1 md:h-24 bg-gray-300 my-6 md:my-0 md:mx-8"></div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl text-center mb-4 text-gray-700">
          Sorry, This page isn't available
        </h2>
        <Link to="/">
          <button className="bg-primary-500 rounded-full px-6 py-3 text-white font-semibold hover:bg-primary-600 transition-colors shadow-lg">
            <span className="text-xl">Go To Home Page</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
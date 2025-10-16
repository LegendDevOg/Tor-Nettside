import { useFontSize } from '../../data/FontSizeContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

function Header() {
  const { scale, increaseSize, decreaseSize } = useFontSize();
  const navigate = useNavigate();

  return (
    <>
      {/* Logo - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition-all hover:scale-105"
          title="Gå til hjemmesiden"
        >
          <img src={logo} alt="Tor logo" className="h-10 w-10" />
        </button>
      </div>

      {/* Font Size Controls - Top Right */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <div className="flex items-center gap-1 bg-white rounded-lg shadow-md px-2 py-1">
          <button
            onClick={decreaseSize}
            disabled={scale <= 0.5}
            className={`px-3 py-1 font-bold text-lg transition-all ${
              scale <= 0.5
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 rounded'
            }`}
            title="Reduser tekststørrelse"
          >
            A-
          </button>
          <button
            onClick={increaseSize}
            disabled={scale >= 1.45}
            className={`px-3 py-1 font-bold text-lg transition-all ${
              scale >= 1.45
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 rounded'
            }`}
            title="Øk tekststørrelse"
          >
            A+
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;


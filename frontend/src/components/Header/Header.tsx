import { useFontSize } from '../../data/FontSizeContext';

function Header() {
  const { scale, increaseSize, decreaseSize } = useFontSize();

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
      {/* Font Size Controls */}
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-md px-2 py-1">
        <button
          onClick={decreaseSize}
          disabled={scale <= 0.85}
          className={`px-3 py-1 font-bold text-lg transition-all ${
            scale <= 0.85
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
  );
}

export default Header;


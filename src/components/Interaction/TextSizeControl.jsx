import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useScreenReader } from '../../context/ScreenReaderContext';

const TextSizeControl = () => {
  const { increaseFont, decreaseFont, fontScale } = useAccessibility();
  const { speak } = useScreenReader();

  const handleIncrease = () => {
    increaseFont();
    speak(`Texto aumentado. Escala actual ${(fontScale + 0.1).toFixed(1)}`);
  };

  const handleDecrease = () => {
    decreaseFont();
    speak(`Texto reducido. Escala actual ${(fontScale - 0.1).toFixed(1)}`);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white p-2 rounded-lg shadow-lg border-2 border-black">
      <button 
        onClick={handleDecrease}
        className="w-12 h-12 bg-gray-200 text-black font-bold text-xl rounded hover:bg-gray-300 flex items-center justify-center border border-gray-400"
        aria-label="Disminuir tamaño de letra"
      >
        A-
      </button>
      
      <div className="flex items-center justify-center px-2 font-bold min-w-[3rem]">
        {Math.round(fontScale * 100)}%
      </div>

      <button 
        onClick={handleIncrease}
        className="w-12 h-12 bg-black text-white font-bold text-xl rounded hover:bg-gray-800 flex items-center justify-center border border-black"
        aria-label="Aumentar tamaño de letra"
      >
        A+
      </button>
    </div>
  );
};

export default TextSizeControl;
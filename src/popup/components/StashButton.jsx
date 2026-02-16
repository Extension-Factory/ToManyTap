import React from 'react';
import { t } from '../lang';

function StashButton({ onClick, disabled, tabCount, lang }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 rounded-lg font-bold text-white text-base transition duration-200 flex items-center justify-center gap-2 ${
        disabled
          ? 'bg-gray-600 cursor-not-allowed opacity-50'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-95 shadow-lg'
      }`}
    >
      <span className="text-xl">⬇️</span>
      <span>{t('stashTabs', lang)}</span>
    </button>
  );
}

export default StashButton;

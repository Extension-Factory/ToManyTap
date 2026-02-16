import React from 'react';
import { t } from '../lang';

function DonateModal({ onClose, lang }) {
  const openBuyMeACoffee = () => {
    chrome.tabs.create({ url: 'https://buymeacoffee.com/4n5rud' });
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm border border-amber-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-5 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white text-center">☕ {t('donate', lang)}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 text-center text-sm leading-relaxed">
            {t('donateDesc', lang)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition"
          >
            {t('noThanks', lang)}
          </button>
          <button
            onClick={openBuyMeACoffee}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-lg text-white font-bold transition"
          >
            {t('supportButton', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonateModal;

import React, { useEffect, useState } from 'react';

function DeleteUndoModal({ sessionName, timeLeft, onUndo, onPermanentDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm border border-red-500 animate-pulse">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white text-center">🗑️ Session Deleted</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 text-center text-sm leading-relaxed mb-4">
            <span className="font-semibold">"{sessionName}"</span> has been deleted
          </p>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">Restore within:</p>
            <div className="inline-block px-4 py-2 bg-red-900 bg-opacity-30 rounded-lg border border-red-600">
              <p className="text-2xl font-bold text-red-400">{timeLeft}s</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onPermanentDelete}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition"
          >
            Delete Anyway
          </button>
          <button
            onClick={onUndo}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white font-bold transition"
          >
            ↶ Undo
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUndoModal;

import React, { useState } from 'react';
import { formatDate } from '../utils';
import { t } from '../lang';

function SessionCard({ session, onRestore, onDelete, onRemoveTab, onDrop, lang }) {
  const [showPreview, setShowPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const tabCount = session.tabs.length;
  const createdDate = formatDate(session.createdAt);

  const faviconUrls = session.tabs.slice(0, 5).map(tab => tab.favIconUrl).filter(Boolean);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(session.id, e);
  };

  return (
    <div 
      className={`bg-gray-800 border rounded-lg p-3 hover:border-purple-500 transition group ${isDragOver ? 'border-green-500 bg-green-900 bg-opacity-20' : 'border-gray-700'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-sm">{session.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{createdDate}</p>
        </div>
        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-600 text-white whitespace-nowrap">
          {tabCount}
        </span>
      </div>

      {/* Favicon Preview */}
      {faviconUrls.length > 0 && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {faviconUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="favicon"
              className="w-4 h-4 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
          {session.tabs.length > 5 && (
            <span className="text-xs text-gray-500 ml-0.5 flex items-center">+{session.tabs.length - 5}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onRestore}
          className="flex-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-medium text-white transition"
          title={t('restore', lang)}
        >
          ↻ {t('restore', lang)}
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium text-white transition"
          title={t('preview', lang)}
        >
          👁️ {t('preview', lang)}
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs font-medium text-white transition"
          title={t('delete', lang)}
        >
          🗑️
        </button>
      </div>

      {/* Drag and Drop Hint */}
      {isDragOver && (
        <div className="mt-2 pt-2 border-t border-green-500 text-center text-green-300 text-xs font-medium">
          ↓ {t('dropTabsHint', lang)}
        </div>
      )}

      {/* Preview Section */}
      {showPreview && (
        <div className="mt-2 pt-2 border-t border-gray-700 max-h-40 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-1.5 font-semibold">{t('tabsInSession', lang)}</p>
          <ul className="space-y-1">
            {session.tabs.map((tab, idx) => (
              <li key={idx} className="text-xs text-gray-300 truncate flex items-center gap-1.5 hover:text-white group/tab">
                {tab.favIconUrl && (
                  <img src={tab.favIconUrl} alt="icon" className="w-3 h-3 flex-shrink-0 rounded" onError={(e) => e.target.style.display = 'none'} />
                )}
                <a 
                  href={tab.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="truncate hover:underline flex-1"
                  title={tab.title || tab.url}
                >
                  {tab.title || tab.url}
                </a>
                <button
                  onClick={() => onRemoveTab(session.id, idx)}
                  className="px-1.5 py-0.5 bg-red-700 hover:bg-red-600 rounded text-xs text-white opacity-0 group-hover/tab:opacity-100 transition flex-shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SessionCard;

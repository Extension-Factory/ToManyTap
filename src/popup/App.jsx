import React, { useState, useEffect } from 'react';
import { getSessions, getCurrentTabCount, getCurrentTabs, stashAllTabs, deleteSession, restoreSession, removeTabFromSession, addTabsToSession, saveSession } from './storage';
import { getLang, setLang, t } from './lang';
import SessionCard from './components/SessionCard';
import StashButton from './components/StashButton';
import DonateModal from './components/DonateModal';
import DeleteUndoModal from './components/DeleteUndoModal';

function App() {
  const [sessions, setSessions] = useState([]);
  const [currentTabs, setCurrentTabs] = useState([]);
  const [tabCount, setTabCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSessionNameInput, setShowSessionNameInput] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [error, setError] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [lang, setLangState] = useState('en');
  const [selectedTabForSession, setSelectedTabForSession] = useState(null);
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [deletedSession, setDeletedSession] = useState(null);
  const [undoTimeLeft, setUndoTimeLeft] = useState(5);
  const [undoTimer, setUndoTimer] = useState(null);

  useEffect(() => {
    (async () => {
      const currentLang = await getLang();
      setLangState(currentLang);
      loadData();
    })();
    // Refresh data every time popup opens
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Timer for undo
  useEffect(() => {
    if (deletedSession && undoTimeLeft > 0) {
      const timer = setTimeout(() => {
        setUndoTimeLeft(undoTimeLeft - 1);
      }, 1000);
      setUndoTimer(timer);
      return () => clearTimeout(timer);
    } else if (deletedSession && undoTimeLeft === 0) {
      // Auto-delete after timeout
      handlePermanentDelete();
    }
  }, [deletedSession, undoTimeLeft]);

  async function loadData() {
    try {
      const count = await getCurrentTabCount();
      const tabs = await getCurrentTabs();
      const sessionsList = await getSessions();
      setTabCount(count);
      setCurrentTabs(tabs);
      setSessions(sessionsList);
      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load sessions');
    }
  }

  async function handleStash() {
    if (!sessionName.trim() && !showSessionNameInput) {
      setShowSessionNameInput(true);
      return;
    }

    if (tabCount === 0) {
      showToast('No tabs to stash! 🌟');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await stashAllTabs(sessionName || undefined);
      if (result.success) {
        showToast(`🎉 ${result.count} tabs stashed!`);
        setTabCount(0);
        setSessions([result.session, ...sessions]);
        setSessionName('');
        setShowSessionNameInput(false);
      } else {
        showToast('❌ No tabs to stash');
      }
    } catch (error) {
      console.error('Failed to stash tabs:', error);
      setError('Failed to stash tabs');
      showToast('❌ Failed to stash tabs');
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(sessionId) {
    setLoading(true);
    setError(null);
    try {
      const result = await restoreSession(sessionId);
      if (result.success) {
        showToast(`✅ ${result.restoredCount} tabs restored!`);
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadData();
      } else {
        showToast('❌ Failed to restore session');
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      setError('Failed to restore session');
      showToast('❌ Failed to restore session');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(sessionId) {
    try {
      const sessionToDelete = sessions.find(s => s.id === sessionId);
      if (!sessionToDelete) return;

      // Show undo modal and save the session temporarily
      setDeletedSession(sessionToDelete);
      setUndoTimeLeft(5);
      
      // Remove from UI immediately
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Failed to delete session:', error);
      setError('Failed to delete session');
    }
  }

  async function handleUndo() {
    try {
      if (undoTimer) clearTimeout(undoTimer);
      
      // Restore session to storage
      await saveSession(deletedSession);
      
      // Restore to UI
      setSessions([deletedSession, ...sessions]);
      setDeletedSession(null);
      setUndoTimeLeft(5);
      showToast('✅ Session restored');
    } catch (error) {
      console.error('Failed to undo delete:', error);
      setError('Failed to restore session');
    }
  }

  async function handlePermanentDelete() {
    try {
      if (deletedSession) {
        await deleteSession(deletedSession.id);
      }
      setDeletedSession(null);
      setUndoTimeLeft(5);
    } catch (error) {
      console.error('Failed to permanently delete session:', error);
      setError('Failed to delete session');
    }
  }

  async function handleRemoveTab(sessionId, tabIndex) {
    try {
      const result = await removeTabFromSession(sessionId, tabIndex);
      if (result.success) {
        showToast('✕ Tab removed');
        await loadData();
      }
    } catch (error) {
      console.error('Failed to remove tab:', error);
      setError('Failed to remove tab');
      showToast('❌ Failed to remove tab');
    }
  }

  async function handleDropTabs(sessionId, e) {
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (!dragData) return;

      const tabData = JSON.parse(dragData);
      const result = await addTabsToSession(sessionId, [tabData]);
      
      if (result.success) {
        showToast('✅ Tab added to session!');
        await loadData();
      }
    } catch (error) {
      console.error('Failed to add tab to session:', error);
      setError('Failed to add tab to session');
      showToast('❌ Failed to add tab');
    }
  }

  async function handleAddCurrentTabToSession(tab, sessionId) {
    try {
      const result = await addTabsToSession(sessionId, [tab]);
      if (result.success) {
        showToast('✅ Tab added to session!');
        setSelectedTabForSession(null);
        await loadData();
      }
    } catch (error) {
      console.error('Failed to add tab to session:', error);
      setError('Failed to add tab to session');
      showToast('❌ Failed to add tab');
    }
  }

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">📑 {t('title', lang)}</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const newLang = lang === 'en' ? 'ko' : 'en';
                setLang(newLang);
                setLangState(newLang);
              }}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded px-2 py-1 transition text-sm font-medium"
              title={t('language', lang)}
            >
              {lang === 'en' ? '한국어' : 'English'}
            </button>
            <button 
              onClick={() => setShowDonateModal(true)}
              className="bg-amber-500 hover:bg-amber-600 rounded-lg px-3 py-2 transition font-bold text-base"
              title={t('donate', lang)}
            >
              ☕
            </button>
          </div>
        </div>
        <div className="text-sm text-white text-opacity-90">
          {tabCount > 0 ? `📊 ${tabCount} ${t('tabsOpen', lang)}` : `✨ ${t('allClean', lang)}`}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Main Stash Button Section */}
      <div className="px-6 py-4 border-b border-gray-700">
        {showSessionNameInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('sessionName', lang)}
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleStash();
                if (e.key === 'Escape') {
                  setShowSessionNameInput(false);
                  setSessionName('');
                }
              }}
              disabled={loading}
              autoFocus
            />
            <button
              onClick={handleStash}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-white font-medium transition"
              title="Stash tabs with custom name"
            >
              ✓
            </button>
            <button
              onClick={() => {
                setShowSessionNameInput(false);
                setSessionName('');
              }}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 rounded text-white font-medium transition"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        ) : (
          <StashButton
            onClick={handleStash}
            disabled={loading || tabCount === 0}
            tabCount={tabCount}
            lang={lang}
          />
        )}
      </div>

      {/* Currently Open Tabs Section */}
      {currentTabs.length > 0 && (
        <div className="px-6 py-3 border-b border-gray-700">
          <h2 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            📂 {t('currentlyOpenTabs', lang)} ({currentTabs.length})
          </h2>
          <p className="text-xs text-gray-500 mb-2">{t('dragToAddSessions', lang)}</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {currentTabs.map((tab, idx) => (
              <div 
                key={idx}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'copy';
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    title: tab.title,
                    url: tab.url,
                    favIconUrl: tab.favIconUrl
                  }));
                }}
                className="bg-gray-800 border border-gray-700 rounded p-1.5 flex items-center gap-2 hover:border-blue-500 hover:bg-gray-750 transition cursor-move active:opacity-50"
              >
                {tab.favIconUrl && (
                  <img 
                    src={tab.favIconUrl} 
                    alt="icon" 
                    className="w-3 h-3 flex-shrink-0 rounded" 
                    onError={(e) => e.target.style.display = 'none'} 
                  />
                )}
                <span className="text-xs text-gray-300 truncate flex-1" title={tab.title}>
                  {tab.title || tab.url}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">≣</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-sm font-medium">{t('noSessions', lang)}</p>
            <p className="text-xs text-gray-500 mt-1">{t('startStashing', lang)}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onRestore={() => handleRestore(session.id)}
                onDelete={() => handleDelete(session.id)}
                onRemoveTab={handleRemoveTab}
                onDrop={handleDropTabs}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white text-sm shadow-lg animate-fade-in z-50">
          {toast}
        </div>
      )}

      {/* Donate Modal */}
      {showDonateModal && (
        <DonateModal 
          onClose={() => setShowDonateModal(false)}
          lang={lang}
        />
      )}

      {/* Delete Undo Modal */}
      {deletedSession && (
        <DeleteUndoModal
          sessionName={deletedSession.name}
          timeLeft={undoTimeLeft}
          onUndo={handleUndo}
          onPermanentDelete={handlePermanentDelete}
        />
      )}
    </div>
  );
}

export default App;

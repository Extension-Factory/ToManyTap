// Background Service Worker for ToManyTab
// Handles tab queries and storage operations

// Service worker initialization
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialize default storage
    chrome.storage.local.get(['sessions', 'settings'], (result) => {
      if (!result.sessions) {
        chrome.storage.local.set({
          sessions: [],
          settings: {
            autoDeleteAfterRestore: false,
            darkMode: true,
          },
        });
      }
    });
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // This listener can be used for future features if needed
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'stashTabs') {
    handleStashTabs(request.sessionName).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // keep the message channel open for async response
  }
});

async function handleStashTabs(sessionName) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  
  if (tabs.length === 0) {
    return { success: false, count: 0 };
  }

  // Prepare tab data
  const tabsData = tabs
    .filter(tab => !tab.url.startsWith('chrome://'))
    .map(tab => ({
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl || '',
    }));

  if (tabsData.length === 0) {
    return { success: false, count: 0 };
  }

  // Create session object
  const session = {
    id: generateUUID(),
    name: sessionName || `Session ${new Date().toLocaleString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}`,
    createdAt: Date.now(),
    tabs: tabsData,
  };

  // Get existing sessions
  const { sessions = [] } = await chrome.storage.local.get('sessions');
  sessions.unshift(session); // Add new session at the beginning

  // Save to storage
  await chrome.storage.local.set({ sessions });

  // Close all tabs
  const tabIds = tabs.filter(tab => !tab.url.startsWith('chrome://')).map(tab => tab.id);
  if (tabIds.length > 0) {
    await chrome.tabs.remove(tabIds);
  }

  return { success: true, count: tabsData.length, session };
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

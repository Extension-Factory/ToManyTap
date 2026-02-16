// Storage utility functions for ToManyTab

export async function getSessions() {
  const { sessions = [] } = await chrome.storage.local.get('sessions');
  return sessions;
}

export async function getSession(id) {
  const sessions = await getSessions();
  return sessions.find(s => s.id === id);
}

export async function saveSession(session) {
  const sessions = await getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  
  if (index > -1) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  
  await chrome.storage.local.set({ sessions });
}

export async function deleteSession(id) {
  const sessions = await getSessions();
  const filtered = sessions.filter(s => s.id !== id);
  await chrome.storage.local.set({ sessions: filtered });
}

export async function removeTabFromSession(sessionId, tabIndex) {
  const sessions = await getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) return { success: false };
  
  session.tabs.splice(tabIndex, 1);
  
  // If no tabs left, delete the session
  if (session.tabs.length === 0) {
    return await deleteSession(sessionId);
  }
  
  await saveSession(session);
  return { success: true, remainingTabs: session.tabs.length };
}

export async function addTabsToSession(sessionId, tabs) {
  const sessions = await getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) return { success: false };
  
  // Add new tabs to the session
  const newTabs = tabs.map(tab => ({
    title: tab.title,
    url: tab.url,
    favIconUrl: tab.favIconUrl || '',
  }));
  
  session.tabs.unshift(...newTabs);
  await saveSession(session);
  
  return { success: true, totalTabs: session.tabs.length };
}

export async function restoreSession(id) {
  const session = await getSession(id);
  if (!session) return { success: false };

  for (const tab of session.tabs) {
    try {
      await chrome.tabs.create({ url: tab.url });
    } catch (error) {
      console.error('Failed to restore tab:', tab.url, error);
    }
  }

  return { success: true, restoredCount: session.tabs.length };
}

export async function getSettings() {
  const { settings = { autoDeleteAfterRestore: false, darkMode: true } } = 
    await chrome.storage.local.get('settings');
  return settings;
}

export async function saveSettings(settings) {
  await chrome.storage.local.set({ settings });
}

export async function getCurrentTabCount() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs.filter(tab => !tab.url.startsWith('chrome://')).length;
}

export async function getCurrentTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs
    .filter(tab => !tab.url.startsWith('chrome://'))
    .map(tab => ({
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl || '',
    }));
}

export async function stashAllTabs(sessionName) {
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

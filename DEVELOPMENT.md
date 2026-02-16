# 🛠 Development Guide - ToManyTab

## Project Architecture

### Tech Stack
- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Storage:** Chrome Local Storage API
- **Build Tool:** Vite with rollup
- **Runtime:** Chrome Extension Manifest V3

### Component Hierarchy

```
App (Main)
├── Header (Static)
├── StashButton (or NameInput)
├── SessionList
│   └── SessionCard[] (Repeating)
│       ├── SessionInfo
│       ├── Actions (Restore, Preview, Delete)
│       └── Preview (Conditional)
└── Toast (Conditional)
```

---

## Core API Reference

### Storage Functions (`storage.js`)

#### `getCurrentTabCount()`
Returns the number of open tabs in current window (excluding chrome:// tabs)
```javascript
const count = await getCurrentTabCount();
// Returns: number
```

#### `getSessions()`
Retrieves all saved sessions
```javascript
const sessions = await getSessions();
// Returns: Session[]
```

#### `getSession(id)`
Get a specific session by ID
```javascript
const session = await getSession('uuid-1234');
// Returns: Session | undefined
```

#### `stashAllTabs(sessionName?)`
Save all open tabs as a new session and close them
```javascript
const result = await stashAllTabs('Shopping');
// Returns: { success: boolean, count: number, session: Session }
```

#### `restoreSession(id)`
Reopen all tabs from a specific session
```javascript
const result = await restoreSession('uuid-1234');
// Returns: { success: boolean, restoredCount: number }
```

#### `deleteSession(id)`
Remove a session from storage
```javascript
await deleteSession('uuid-1234');
```

#### `saveSession(session)`
Update an existing session
```javascript
await saveSession({ ...session, name: 'New Name' });
```

#### `getSettings()` / `saveSettings(settings)`
Get and set user preferences
```javascript
const settings = await getSettings();
await saveSettings({ autoDeleteAfterRestore: true, darkMode: false });
```

---

## Data Models

### Session Object
```typescript
interface Session {
  id: string;                    // UUID
  name: string;                  // User-friendly name
  createdAt: number;             // Unix timestamp (milliseconds)
  tabs: Tab[];                   // Array of tab objects
}
```

### Tab Object
```typescript
interface Tab {
  title: string;                 // Page title
  url: string;                   // Full URL
  favIconUrl?: string;           // Favicon URL (optional)
}
```

### Settings Object
```typescript
interface Settings {
  autoDeleteAfterRestore: boolean;
  darkMode: boolean;
}
```

### Storage Structure
```json
{
  "sessions": [
    {
      "id": "uuid...",
      "name": "String",
      "createdAt": 1234567890,
      "tabs": [...]
    }
  ],
  "settings": {
    "autoDeleteAfterRestore": false,
    "darkMode": true
  }
}
```

---

## Background Service Worker (`background.js`)

The service worker handles:
- Initialization and setup on extension install
- Tab queries and manipulation
- Storage operations
- Message routing from popup

### Key Functions

#### `handleStashTabs(sessionName)`
Core stashing logic:
1. Queries all tabs in current window
2. Filters out chrome:// URLs
3. Creates session object
4. Saves to storage
5. Closes all tabs

#### UUID Generation
```javascript
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
```

---

## React Components Guide

### App.jsx
**Main application component**

**State:**
- `sessions` - Array of Session objects
- `tabCount` - Number of open tabs
- `loading` - Loading state for async operations
- `toast` - Toast notification message
- `showSessionNameInput` - Show input field for custom name
- `sessionName` - Current input value
- `error` - Error message to display

**Key Methods:**
- `loadData()` - Fetch sessions and tab count
- `handleStash()` - Save tabs as session
- `handleRestore(id)` - Reopen session tabs
- `handleDelete(id)` - Remove session
- `showToast(msg)` - Display temporary message

**Lifecycle:**
- Loads data on mount
- Listens for window focus (mobile-friendly)

---

### SessionCard.jsx
**Displays a single session**

**Props:**
```javascript
{
  session: Session,           // Session object to display
  onRestore: (id) => void,   // Callback for restore button
  onDelete: (id) => void     // Callback for delete button
}
```

**Features:**
- Conditional favicon display (first 5)
- Expandable preview of all tabs
- Action buttons (Restore, Preview, Delete)
- Responsive truncation of long names

---

### StashButton.jsx
**Main action button**

**Props:**
```javascript
{
  onClick: () => void,        // Button click handler
  disabled: boolean,          // Disable state
  tabCount: number           // Number of tabs to display
}
```

**Styling:**
- Gradient background (blue to cyan)
- Disabled state with reduced opacity
- Active state with scale effect

---

### Utility Functions (`utils.js`)

```javascript
generateUUID()              // Create unique ID
formatDate(timestamp)       // Format date for display
getDomainFromUrl(url)      // Extract domain from URL
getHostIcon(domain)        // Get favicon from domain
```

---

## Chrome Extension APIs Used

### Tabs API
```javascript
chrome.tabs.query({ currentWindow: true })  // Get all tabs
chrome.tabs.create({ url })                 // Open new tab
chrome.tabs.remove([ids])                   // Close tabs
```

### Storage API
```javascript
chrome.storage.local.get(keys)  // Retrieve data
chrome.storage.local.set(data)  // Save data
```

### Runtime API
```javascript
chrome.runtime.onInstalled        // First install
chrome.runtime.onMessage          // Message passing
```

---

## Development Tips

### Debugging
1. **View Extension Logs:**
   - chrome://extensions/ → Details → Inspect views → service worker

2. **Debug Popup:**
   - Right-click extension icon → Inspect popup

3. **Check Storage:**
   - DevTools → Application → Storage → Chrome Extension

4. **Background Script Errors:**
   - chrome://extensions/ → Errors panel

### Hot Reload During Development
1. Save files (Vite watches automatically)
2. Run `npm run build` to rebuild extension files
3. Click refresh icon on extension in extensions page
4. Reload popup to see changes

### Testing Storage
```javascript
// In popup DevTools console:
chrome.storage.local.get(null, (data) => console.log(data));
```

### Simulating Tab Operations
```javascript
// Create test tabs manually, then test stashing
// Delete chrome history if needed for clean slate
```

---

## Common Issues & Solutions

### Issue: "Cannot access chrome.tabs"
- Service worker must make tabs API calls
- Popup does indirect calls through storage/background

### Issue: Tabs not stashing
- Check console for errors
- Verify tabs aren't chrome:// URLs
- Ensure storage has write permissions

### Issue: Memory usage high
- Clean up old sessions regularly
- Consider archive feature for future versions

### Issue: Favicons not loading
- Use google.com favicon service as fallback
- Handle CORS issues with chrome:// protocol

---

## Performance Considerations

- **Max Sessions:** No hard limit (limited by local storage quota ~10MB)
- **Tab Open Time:** ~50-200ms per tab depending on size
- **Session Save Time:** ~10-50ms regardless of count
- **Memory Impact:** ~5KB per saved tab + minimal runtime overhead

---

## Security & Privacy

✅ **What we do right:**
- All data stored locally (no cloud)
- No network requests for session data
- No tracking or analytics
- No permissions beyond necessary (tabs, storage)

⚠️ **Future considerations:**
- Consider encryption for sensitive tabs
- Implement session passwords
- Add privacy mode (don't save certain URLs)

---

## Build Process

1. **Vite compiles React:**
   - JSX → JS
   - CSS → compiled with Tailwind
   - Assets bundled and optimized

2. **Copy assets script:**
   - Copies manifest.json
   - Copies background.js
   - Copies popup.html
   - Creates icon files

3. **Output structure:**
   ```
   dist/
   ├── manifest.json
   ├── popup.html
   ├── popup.js (compiled React)
   ├── index.css (compiled Tailwind)
   ├── background.js
   └── icons/
       ├── icon-16.png
       ├── icon-48.png
       └── icon-128.png
   ```

---

## Testing Checklist

- [ ] Stashing 0 tabs (should show error)
- [ ] Stashing 1 tab
- [ ] Stashing 50+ tabs  
- [ ] Custom session names
- [ ] Special characters in session name
- [ ] Very long tab titles
- [ ] Tabs with invalid URLs
- [ ] Chrome extension pages
- [ ] Restoring with some deleted tabs
- [ ] Deleting multiple sessions
- [ ] Extension crash recovery
- [ ] Storage quota warnings

---

## Future Roadmap Ideas

1. **Session Management**
   - Rename sessions from popup
   - Add tags/categories
   - Search functionality
   - Bulk operations

2. **Advanced Features**
   - Keyboard shortcuts
   - Auto-stash on timer
   - Scheduled stashing
   - Session templates

3. **Sync & Cloud**
   - Google Drive backup
   - OneDrive integration
   - Multi-device sync
   - Cloud encryption

4. **Browser Support**
   - Firefox version
   - Edge support
   - Safari support

5. **Premium Features**
   - Unlimited cloud storage
   - Advanced analytics
   - Priority support
   - Custom themes

---

**Happy Coding! 🚀**

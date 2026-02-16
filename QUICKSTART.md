# 🚀 Quick Start Guide - ToManyTab

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Extension
```bash
npm run build
```

This will:
- Compile React components using Vite
- Generate CSS from Tailwind
- Copy manifest and background scripts to `dist/` folder
- Create icon files

### Step 3: Load in Chrome

1. Open Chrome and go to **chrome://extensions/**
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `dist` folder from this project
5. The ToManyTab extension should now appear in your extensions!

---

## Development Workflow

### For Active Development:

1. **Terminal 1 - Start Vite dev server:**
   ```bash
   npm run dev
   ```

2. **Terminal 2 - Watch and rebuild extension files:**
   ```bash
   npm run build
   ```

3. In Chrome Extensions page:
   - Click the **refresh icon** on ToManyTab after making changes
   - Or press `Ctrl+Shift+R` (Windows/Linux) / `Cmd+Shift+R` (Mac)

---

## Testing the Extension

### Manual Testing Checklist:

- [ ] **Stash Tabs**
  - Open 5-10 tabs in Chrome
  - Click the ToManyTab icon
  - Click "Stash All & Close" without a custom name
  - All tabs should close and be saved

- [ ] **Custom Session Names**
  - Open 5-10 tabs
  - Click ToManyTab icon
  - Click "Stash All & Close"
  - Enter a custom name like "Shopping"
  - Verify the session appears with your custom name

- [ ] **Restore Tabs**
  - Have at least one saved session
  - Click "Restore" button
  - All tabs should reopen in the background

- [ ] **Preview Tabs**
  - Click "Preview" on a session card
  - List of tabs should appear with titles and favicons
  - Click on a tab title to open it directly

- [ ] **Delete Sessions**
  - Click the trash icon (🗑️) on a session
  - Session should be removed from the list

- [ ] **Tab Counter**
  - Should show correct count of open tabs
  - Should show "✨ All clean!" when no tabs are open

- [ ] **Toast Notifications**
  - Should see success/error messages after actions
  - Notifications should disappear after 3 seconds

---

## Folder Structure

```
ToManyTab/
├── src/
│   ├── popup/                 # React popup UI
│   │   ├── App.jsx
│   │   ├── popup.jsx
│   │   ├── storage.js         # Storage API wrapper
│   │   ├── utils.js           # Utility functions
│   │   ├── index.css          # Styling
│   │   └── components/
│   │       ├── StashButton.jsx
│   │       └── SessionCard.jsx
│   └── background/            # Service worker
│       └── background.js
├── public/
│   ├── manifest.json          # Extension manifest
│   └── popup.html             # HTML template
├── dist/                       # Built extension (generated)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── copy-assets.js
└── README.md
```

---

## File Descriptions

### **manifest.json**
- Chrome extension configuration
- Declares permissions (tabs, storage)
- Links popup HTML and background service worker

### **popup.html**
- Template for the extension popup
- Root div for React mounting
- Links to CSS and JS bundles

### **App.jsx**
- Main React component
- Handles state management
- Orchestrates all functionality

### **storage.js**
- Wrapper around Chrome Storage API
- Functions: getSessions, restoreSession, deleteSession, stashAllTabs

### **background.js**
- Service worker script
- Handles Chrome API calls
- Listens for messages from popup

### **SessionCard.jsx**
- Displays individual session as a card
- Shows tab count, favicons, actions
- Preview functionality

### **StashButton.jsx**
- Main action button
- Dynamic text based on tab count

---

## Troubleshooting

### Extension not appearing in Chrome?
- Make sure you're in **Developer mode**
- Path to `dist/` folder must exist
- Check for errors in the **Errors** tab in chrome://extensions/

### Changes not reflecting?
- Click the refresh icon on the extension in extensions page
- Or reload the popup with `Ctrl+Shift+R`

### Storage not persisting?
- Check Chrome's storage permissions
- Look at chrome extension's "Storage" in DevTools
- Clear extension data and try again: chrome://extensions/ → Details → Clear data

### Tabs not restoring?
- Some special URLs (like chrome://, about:, etc.) cannot be restored
- Make sure tabs have valid URLs
- Check Console (DevTools) for errors

---

## Useful Chrome Extension Resources

- [Chrome Extension API Docs](https://developer.chrome.com/docs/extensions/reference/)
- [manifest.json Reference](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Extension DevTools](https://developer.chrome.com/docs/extensions/mv3/devtools/)

---

## Future Enhancements

- [ ] Keyboard shortcuts (Ctrl+Shift+S to stash)
- [ ] Cloud sync to Google Drive/OneDrive
- [ ] Export/Import sessions as JSON
- [ ] Search and filter sessions
- [ ] Rename sessions from popup
- [ ] Undo delete session
- [ ] Session tags/categories
- [ ] Auto-stash after N minutes of inactivity
- [ ] Settings page
- [ ] Firefox/Edge support

---

**Happy Tab Stashing! 📑**

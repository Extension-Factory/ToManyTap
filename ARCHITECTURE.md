# 🏗️ ToManyTab Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   CHROME BROWSER                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ BACKGROUND (Service Worker)                          │  │
│  │ background.js                                     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ ✓ chrome.tabs API                                    │  │
│  │ ✓ chrome.storage API                                 │  │
│  │ ✓ Message listeners                                  │  │
│  │ ✓ handleStashTabs()                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│         ▲                                    │              │
│         │ Query & Remove                      │ Storage      │
│         │ Tabs                                 │ Messages    │
│         │                                      ▼              │
│  ┌──────┴──────────────────────────────────────────────┐  │
│  │ POPUP (React UI)                                     │  │
│  │ popup.html / popup.jsx                              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ APP.JSX (Main Component)                       │  │  │
│  │  │ - State: sessions, tabCount, loading, toast    │  │  │
│  │  │ - Handlers: stash, restore, delete             │  │  │
│  │  │ - Storage wrapper layer (storage.js)           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │    ▲              ▲                ▲         ▲        │  │
│  │    │ Props        │ Props         │ Props  │ Props   │  │
│  │    │              │               │        │         │  │
│  │  ┌─┴──────────┐ ┌─┴──────────┐ ┌─┴──────┐ ┌┴──────┐  │  │
│  │  │StashButton │ │SessionCard │ │Toast   │ │Header │  │  │
│  │  │            │ │            │ │        │ │       │  │  │
│  │  │ ⬇ Stash    │ │ ✓ Restore  │ │ 🎉     │ │📑     │  │  │
│  │  │ ✓ Click    │ │ 👁 Preview │ │ Success│ │Config │  │  │
│  │  │ ✓ Input    │ │ 🗑 Delete  │ │        │ │       │  │  │
│  │  └────────────┘ └────────────┘ └────────┘ └───────┘  │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│         ▲                                                   │
│         │ Read/Write Sessions                               │
│         │                                                   │
│  ┌──────┴──────────────────────────────────────────────┐  │
│  │ STORAGE LAYER - storage.js (8 Functions)            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • getSessions()         ┐                            │  │
│  │ • getSession(id)        │                            │  │
│  │ • saveSession()         ├─→ chrome.storage.local    │  │
│  │ • deleteSession(id)     │                            │  │
│  │ • stashAllTabs()        │ (Persistent Storage)      │  │
│  │ • restoreSession(id)    │                            │  │
│  │ • getCurrentTabCount()  │                            │  │
│  │ • getSettings()         ┘                            │  │
│  └──────────────────────────────────────────────────────┘  │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────┐      │
│  │ UTILS - utils.js (Helper Functions)              │      │
│  ├──────────────────────────────────────────────────┤      │
│  │ • generateUUID()       - Create unique IDs        │      │
│  │ • formatDate()         - Display timestamps       │      │
│  │ • getDomainFromUrl()   - Extract domain          │      │
│  │ • getHostIcon()        - Get favicon URL         │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         ▲
         │ Extension installed
         │ Permissions: tabs, storage
         │
    ┌────┴────╥─────────────────────────┐
    │manifest.json                       │
    │ ✓ Service worker                   │
    │ ✓ Popup HTML/CSS                   │
    │ ✓ Permissions                      │
    │ ✓ Icons                            │
    └────────────────────────────────────┘
```

## Data Flow Diagram

### Stash Operation
```
User Click
    │
    ├─→ App.handleStash()
    │   │
    │   ├─→ setLoading(true)
    │   │
    │   ├─→ stashAllTabs(sessionName)
    │   │   │
    │   │   ├─→ chrome.tabs.query()
    │   │   │   └─→ [Tab, Tab, Tab...]
    │   │   │
    │   │   ├─→ Filter chrome:// URLs
    │   │   │
    │   │   ├─→ Extract {title, url, faviconUrl}
    │   │   │
    │   │   ├─→ Create Session Object + UUID
    │   │   │
    │   │   ├─→ chrome.storage.local.set()
    │   │   │   └─→ Saved in browser storage
    │   │   │
    │   │   └─→ chrome.tabs.remove(tabIds)
    │   │       └─→ All tabs closed
    │   │
    │   ├─→ setSessions([newSession, ...old])
    │   │
    │   ├─→ showToast("🎉 12 tabs stashed!")
    │   │
    │   └─→ setLoading(false)
    │
    └─→ UI Updates ✅
```

### Restore Operation
```
User Click "Restore"
    │
    ├─→ App.handleRestore(sessionId)
    │   │
    │   ├─→ setLoading(true)
    │   │
    │   ├─→ restoreSession(sessionId)
    │   │   │
    │   │   ├─→ getSession(sessionId)
    │   │   │   └─→ Session from storage
    │   │   │
    │   │   ├─→ FOR each tab in session.tabs:
    │   │   │   └─→ chrome.tabs.create({url})
    │   │   │       └─→ Tab opens in background
    │   │   │
    │   │   └─→ Return {success: true, count: N}
    │   │
    │   ├─→ showToast("✅ 12 tabs restored!")
    │   │
    │   ├─→ loadData() - Refresh list
    │   │
    │   └─→ setLoading(false)
    │
    └─→ N tabs open ✅
```

## Component Hierarchy

```
App (Root)
│
├─ Header
│  ├─ Title: 📑 ToManyTab
│  ├─ Settings Button: ⚙️
│  └─ Tab Counter: "12 Tabs Open"
│
├─ Stash Section
│  ├─ StashButton
│  │  └─ Props: onClick, disabled, tabCount
│  │
│  └─ [OR] NameInput
│     ├─ Input Field: sessionName
│     ├─ Confirm Button: ✓
│     └─ Cancel Button: ✕
│
├─ Sessions List
│  │
│  ├─ [IF empty]
│  │  ├─ Icon: 📦
│  │  ├─ Title: "No sessions yet"
│  │  └─ Hint: "Start stashing..."
│  │
│  └─ [IF has sessions]
│     └─ SessionCard[] (repeating)
│        │
│        ├─ SessionInfo
│        │  ├─ Name: session.name
│        │  ├─ Date: formatDate(createdAt)
│        │  └─ Badge: tabCount
│        │
│        ├─ Favicons: first 5 images
│        │
│        ├─ ActionButtons
│        │  ├─ Restore: handleRestore()
│        │  ├─ Preview: togglePreview()
│        │  └─ Delete: handleDelete()
│        │
│        └─ [IF showPreview]
│           └─ TabPreview (list)
│              └─ Tab[] (title + url)
│
└─ Toast (conditional)
   ├─ Message: string
   └─ Auto-dismiss: 3 seconds
```

## State Model

```
App Component State:

┌─ sessions: Session[]
│  └─ Array of saved sessions
│     {id, name, createdAt, tabs[]}
│
├─ tabCount: number
│  └─ Count of currently open tabs
│
├─ loading: boolean
│  └─ true during async operations
│
├─ toast: string | null
│  └─ Current message (if showing)
│
├─ error: string | null
│  └─ Error message (if any)
│
├─ showSessionNameInput: boolean
│  └─ Show or hide name input field
│
└─ sessionName: string
   └─ Current input value
```

## Storage Model

```
Chrome Local Storage

├─ sessions: [
│  ├─ {
│  │  ├─ id: "uuid-1234-5678"
│  │  ├─ name: "Shopping"
│  │  ├─ createdAt: 1708903200000
│  │  └─ tabs: [
│  │     ├─ {title: "Amazon", url: "...", favIconUrl: "..."}
│  │     ├─ {title: "eBay", url: "...", favIconUrl: "..."}
│  │     └─ {...}
│  │  ]
│  │
│  ├─ {...next session...}
│  └─ {...}
│  ]
│
└─ settings: {
   ├─ autoDeleteAfterRestore: false
   └─ darkMode: true
   }
```

## File Structure

```
ToManyTab/
│
├── 📋 Configuration
│   ├── package.json          - Dependencies & scripts
│   ├── vite.config.js        - Build configuration
│   ├── tailwind.config.js    - Style configuration
│   ├── postcss.config.js     - CSS processing
│   └── manifest.json         - Extension manifest
│
├── 📄 Documentation
│   ├── README.md             - Project overview
│   ├── QUICKSTART.md         - Setup guide
│   ├── DEVELOPMENT.md        - Dev reference
│   ├── CHECKLIST.md          - Feature checklist
│   └── INDEX.md              - Navigation guide
│
├── 🔧 Build & Deploy
│   ├── copy-assets.js        - Post-build script
│   ├── build.sh              - Linux/Mac build
│   └── build.bat             - Windows build
│
├── 📁 Source Code
│   │
│   ├── src/popup/
│   │   ├── popup.jsx         - React entry point
│   │   ├── App.jsx           - Main component (280 lines)
│   │   ├── index.css         - Global styles
│   │   ├── storage.js        - Storage API layer (120 lines)
│   │   ├── utils.js          - Utilities (40 lines)
│   │   │
│   │   └── components/
│   │       ├── SessionCard.jsx      - Session display (110 lines)
│   │       └── StashButton.jsx      - Action button (25 lines)
│   │
│   └── src/background/
│       └── background.js    - Service worker (120 lines)
│
├── 📁 Public Assets
│   ├── manifest.json        - Extension manifest
│   └── popup.html           - HTML template
│
└── 📁 dist/ (Generated)
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── index.css
    ├── background.js
    └── icons/
        ├── icon-16.png
        ├── icon-48.png
        └── icon-128.png
```

## Build Process Pipeline

```
Source Code
    │
    ├─→ npm install
    │   └─→ Install dependencies
    │
    ├─→ npm run build
    │   │
    │   ├─→ Vite Build:
    │   │   ├─ Compile JSX → JavaScript
    │   │   ├─ Process CSS with Tailwind
    │   │   ├─ Bundle with rollup
    │   │   └─ Output: dist/popup.js, dist/index.css
    │   │
    │   └─→ copy-assets.js Script:
    │       ├─ Copy manifest.json
    │       ├─ Copy background.js
    │       ├─ Copy popup.html
    │       └─ Create icon files
    │
    └─→ dist/ Folder (Ready to load)
        └─→ chrome://extensions → "Load unpacked"
```

## Request Flow

### User Action → UI Update

```
1. User clicks "Stash All & Close"
        │
        ↓
2. StashButton.onClick() fires
        │
        ↓
3. App.handleStash() called
        │
        ├─→ Check if input needed
        ├─→ Call storage.stashAllTabs()
        │   │
        │   └─→ Chrome APIs:
        │       ├─ tabs.query()
        │       ├─ storage.local.set()
        │       └─ tabs.remove()
        │
        ├─→ Update App state
        │   ├─ setSessions()
        │   ├─ setTabCount()
        │   └─ showToast()
        │
        └─→ React re-renders UI
            ├─ Header updates
            ├─ SessionList shows new card
            └─ Toast appears
```

## Error Handling Flow

```
Try Operation
    │
    ├─→ Success?
    │   └─→ Update state
    │       └─→ showToast("✅ Success!")
    │
    └─→ Failure?
        ├─→ Log error to console
        ├─→ Set error state
        └─→ showToast("❌ Error message")
```

---

## Key Libraries & Versions

```json
{
  "react": "^18.2.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.3.6",
  "postcss": "^8.4.31",
  "autoprefixer": "^10.4.16"
}
```

## Key Files by Responsibility

| Responsibility | Files |
|---|---|
| UI Rendering | App.jsx, SessionCard.jsx, StashButton.jsx |
| State Management | App.jsx (useState/useEffect) |
| Data Persistence | storage.js (Chrome API wrapper) |
| Business Logic | storage.js, background.js |
| Styling | index.css, tailwind.config.js |
| Configuration | manifest.json, vite.config.js |
| Utilities | utils.js |

---

**Architecture Status**: ✅ Clean, Modular, Scalable


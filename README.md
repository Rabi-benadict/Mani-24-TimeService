[README.md](https://github.com/user-attachments/files/25760378/README.md)
# 🕐 Time Converter — Chrome Extension

A powerful Chrome extension for converting timestamps and viewing world clocks across 48 time zones. Built with vanilla JavaScript, HTML, and CSS — no frameworks, no dependencies.

>_Basically I am watch mechanic, Enaku ithulam sarva satharanam ;)_

---

## 🚀 Installation

### Option 1: Clone from GitHub

```bash
git clone https://github.com/Rabi-benadict/Mani-24-TimeService.git
```

### Option 2: Download ZIP

1. Go to the [GitHub repository](https://github.com/Rabi-benadict/Mani-24-TimeService)
2. Click the green **Code** button → **Download ZIP**
3. Extract the ZIP to a folder on your computer

### Load into Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `TimeConverter` folder (the one containing `manifest.json`)
5. The extension icon appears in your toolbar — click the **puzzle piece** 🧩 icon and **pin** it for quick access

> **Tip:** After pulling updates (`git pull`), click the ↻ reload button on the extension card at `chrome://extensions/` to apply changes.

### Set Up Keyboard Shortcut (optional)

1. Go to `chrome://extensions/shortcuts`
2. Find **Time Converter** → **Open Time Converter**
3. Default: `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows/Linux)
4. Click the pencil icon to customize if needed

---

## 📖 How to Use

### 🌍 World Clocks (Tab 1)

1. Open the extension — you'll see your **local time** at the top
2. Below that are your selected **world clocks** updating every second
3. **Add a zone**: Use the dropdown at the bottom → "Add a time zone…"
4. **Remove a zone**: Hover over a clock card → click the **×** button
5. Your selection is saved and synced across devices

### 🔄 Converter (Tab 2)

1. Switch to the **Converter** tab
2. **Smart Paste** (default): Paste any timestamp into the text area — it auto-detects the format
   - Examples: `1709472000000`, `2026-03-03T14:30:00Z`, `26/02/2026 15:11:58`, `2 hours ago`
   - A green badge shows the detected format
   - Press **Enter** to convert
3. **Other input types**: Click the pills to switch — **Millis**, **Epoch (s)**, **Date**, **DateTime**
4. Click **Convert** → see the time in all zones
5. **Pinned zones** appear expanded at the top; others are collapsed below
   - Click "Edit" on the pinned section to add/remove pinned zones
   - Use the search box to find zones quickly
6. **Search results**: Use the 🔍 search bar above results to filter by zone name
7. **Copy**: 
   - Hover any row → click 📋 to copy that single zone
   - Use **Copy Pinned** / **Copy All** buttons with format selector (Table, Inline, Slack, CSV)
8. **History**: Click "🕘 Recent" to see last 10 conversions — click any to reconvert

### ⏱ Time Diff (Tab 3)

1. Switch to the **Time Diff** tab
2. Paste a **Start Time** and **End Time** (any format Smart Paste supports)
3. Click **Calculate Difference**
4. See the duration in days/hours/minutes/seconds, plus totals in milliseconds, seconds, hours, and days

### 📋 Right-Click Context Menu

1. On any webpage, **select** a timestamp text (e.g., highlight `1709472000000`)
2. **Right-click** → click **"Convert '...' with Time Converter"**
3. A blue badge `1` appears on the extension icon
4. **Click the extension icon** → it auto-opens the Converter with your text and shows results

> **Note:** The context menu only works on regular webpages, not on Chrome internal pages like `chrome://extensions`.

### 🎨 Theme Toggle

- Click the **☀️** / **🌙** button in the top-right corner of the header
- Switches between dark and light themes
- Your preference is saved and synced

---

## ✨ Features

### 🌍 World Clocks (Tab 1)
- Live-updating clocks with 1-second refresh
- Shows your local time with timezone name and offset
- Add/remove zones from a dropdown of 20 worldwide cities
- Displays time, date (with year), weekday, and UTC offset
- DST (Daylight Saving Time) badge when applicable

### 🔄 Converter (Tab 2)
- **Smart Paste** — Auto-detects 17+ time formats from pasted text
- **Manual Inputs** — Millis, Epoch (seconds), Date picker, DateTime picker
- Converts to all 20 zones simultaneously
- **Pinned zones** — Favourite zones shown expanded; others collapsed
- **Search zones** — Filter zones in the pinned editor
- **Copy system** — Per-row copy, Copy Pinned, Copy All with 4 formats (Table, Inline, Slack/Chat, CSV)
- **Conversion history** — Last 10 conversions saved, click to reconvert
- **Parsed info card** — Shows millis, epoch, UTC, and local time with click-to-copy

### ⏱ Time Diff (Tab 3)
- Paste two timestamps in any format
- Shows the duration between them (days, hours, minutes, seconds)
- Detailed breakdown: milliseconds, seconds, hours, days
- Direction indicator (End is after/before Start)

### 🎨 Themes
- Dark theme (default) with deep navy palette
- Light theme with clean whites and blues
- Toggle via ☀️/🌙 button in the header
- Preference synced across devices

### ⌨️ Keyboard Shortcut
- **Mac**: `Cmd+Shift+M`
- **Windows/Linux**: `Ctrl+Shift+M`
- Customizable at `chrome://extensions/shortcuts`

### 📋 Right-Click Context Menu
- Select any timestamp text on a webpage
- Right-click → "Convert with Time Converter"
- Opens popup with the value pre-filled and auto-converted

### 💾 Sync Storage
- All settings sync across Chrome devices via `chrome.storage.sync`
- Includes: selected zones, pinned zones, theme, conversion history

---

## 📦 Supported Smart Paste Formats

| Format | Example |
|--------|---------|
| Nanoseconds | `1709472000000000000` |
| Microseconds | `1709472000000000` |
| Milliseconds | `1709472000000` |
| Epoch (seconds) | `1709472000` |
| ISO 8601 | `2026-03-03T14:30:00Z` |
| RFC 2822 | `Tue, 03 Mar 2026 14:30:00 +0530` |
| YYYY-MM-DD | `2026-03-03` |
| MM/DD/YYYY | `03/03/2026` |
| DD/MM/YYYY | `26/02/2026` |
| DD.MM.YYYY | `26.02.2026` |
| DD-MM-YYYY | `26-02-2026` |
| DD-MM-YYYY + time | `26-02-2026 00:39:57` |
| DD-MM-YYYY + ms | `26-02-2026 00:39:57:274` |
| Human date | `Mar 3, 2026 2:30 PM` |
| DateTime (space) | `2026-03-03 14:30:00` |
| Time only | `14:30` or `2:30 PM` |
| Relative time | `2 hours ago`, `in 30 minutes` |
| Slash + time | `03/03/2026 14:30` or `26/02/2026, 15:11:59` |

---

## 🗂 Project Structure

```
TimeConverter/
├── manifest.json        # Chrome Extension Manifest V3
├── background.js        # Service worker (context menu)
├── popup.html           # Extension popup UI (182 lines)
├── popup.css            # Styles — dark/light themes (1188 lines)
├── popup.js             # All extension logic (1186 lines)
├── generate-icons.js    # Node.js script to generate PNG icons
├── icons/
│   ├── icon16.png       # Toolbar icon
│   ├── icon48.png       # Extensions page icon
│   └── icon128.png      # Chrome Web Store icon
└── README.md            # This file
```

---

## 🔧 Code Flow & Architecture

### Initialization Flow

```
DOMContentLoaded
  ├─ loadTheme()               → Apply saved dark/light theme
  ├─ loadSelectedZones()       → Load world clock zones from chrome.storage.sync
  ├─ loadPinnedZones()         → Load pinned converter zones
  ├─ initTabs()                → Wire tab switching (Clocks / Converter / Diff)
  ├─ startClock()              → Begin 1-second interval for world clocks
  ├─ populateAddZoneDropdown() → Fill "Add zone" dropdown
  ├─ initAddZone()             → Handle zone addition
  ├─ initConverter()           → Wire pills, inputs, convert button, copy actions
  ├─ initPinnedZones()         → Wire pinned editor with search filter
  ├─ initThemeToggle()         → Wire ☀️/🌙 button
  ├─ initTimeDiff()            → Wire Time Diff tab
  ├─ initHistory()             → Wire collapsible history section
  ├─ loadAndRenderHistory()    → Render recent conversions
  └─ checkContextInput()       → Check for right-click context menu input
```

### Converter Flow

```
User Action (paste / type / click Convert)
  │
  ├─ parseDateFromInput()
  │   ├─ Smart Paste → smartParse(input)
  │   │   └─ Tries 17+ regex patterns sequentially
  │   │   └─ Returns { date: Date, format: string } or null
  │   ├─ Millis → new Date(Number(input))
  │   ├─ Epoch → new Date(Number(input) * 1000)
  │   ├─ Date → Constructs from date picker + zone
  │   └─ DateTime → Constructs from date + time pickers + zone
  │
  ├─ renderParsedInfo(date)
  │   └─ Shows Millis, Epoch, UTC, Local with click-to-copy
  │
  ├─ saveToHistory(input, format, date)
  │   └─ Saves to chrome.storage.sync (max 10 entries)
  │
  └─ doConvert()
      ├─ Split ALL_ZONES into pinned[] and others[]
      ├─ Render pinned as expanded rows (with DST badge)
      ├─ Render others as collapsed/hidden rows
      ├─ Wire per-row copy buttons
      ├─ Wire toggle "Show all / Collapse others"
      └─ Wire bulk copy (Copy Pinned / Copy All)
```

### Copy Flow

```
Copy Action
  ├─ Per-row copy → "Date, Time — Zone (Offset)"
  ├─ Copy Pinned/All → buildCopyText(zones, date, format)
  │   ├─ Table:  "Date  Time  Zone  (Offset)" — aligned columns
  │   ├─ Inline: "Date, Time — Zone  |  ..." — single line
  │   ├─ Slack:  "Date, `Time` — *Zone* (Offset)" — rich formatting
  │   └─ CSV:    "Date,Time,Zone,Offset" — with header row
  └─ copyToClipboard(text) → navigator.clipboard API + fallback
      └─ showToast() → Animated green notification
```

### Context Menu Flow

```
background.js (Service Worker)
  ├─ onInstalled → Create "Convert with Time Converter" menu item
  └─ onClicked → Save selected text to chrome.storage.local
                  Set badge "1" on extension icon

popup.js (on open)
  └─ checkContextInput()
      ├─ Read chrome.storage.local 'tc_context_input'
      ├─ Switch to Converter tab, Smart Paste mode
      ├─ Fill input and call doConvert()
      └─ Clear storage and badge
```

### Storage Architecture

```
chrome.storage.sync (synced across devices)
  ├─ tc_selected_zones  → string[]    — World clock zone IDs
  ├─ tc_pinned_zones    → string[]    — Pinned converter zone IDs
  ├─ tc_theme           → "dark"|"light"
  └─ tc_history         → object[]    — Last 10 conversions
                            ├─ input     — Original input text
                            ├─ format    — Detected format name
                            ├─ timestamp — The parsed timestamp (ms)
                            └─ savedAt   — When it was saved (ms)

chrome.storage.local (device-only, ephemeral)
  └─ tc_context_input   → string — Right-click selected text (cleared after use)
```

### DST Detection Logic

```
isDST(date, timeZone)
  ├─ Get UTC offset for Jan 1 and Jul 1 of the same year
  ├─ If both offsets are equal → no DST in this zone → false
  ├─ Get current date's offset
  └─ If current offset ≠ standard (minimum) offset → DST active → true
```

---

## 🌐 Supported Time Zones (48)

| Region | Zones |
|--------|-------|
| Oceania & Pacific | 🇳🇿 Auckland, 🇫🇯 Fiji, 🇺🇸 Honolulu |
| Australia | 🇦🇺 Sydney, 🇦🇺 Perth |
| East Asia | 🇯🇵 Tokyo, 🇰🇷 Seoul, 🇨🇳 Shanghai, 🇭🇰 Hong Kong |
| Southeast Asia | 🇸🇬 Singapore, 🇹🇭 Bangkok, 🇮🇩 Jakarta, 🇵🇭 Manila |
| South Asia | 🇮🇳 India (IST), 🇧🇩 Dhaka, 🇵🇰 Karachi |
| Central Asia | 🇰🇿 Almaty |
| Middle East | 🇦🇪 Dubai, 🇸🇦 Riyadh, 🇮🇷 Tehran |
| Africa | 🇪🇬 Cairo, 🇳🇬 Lagos, 🇰🇪 Nairobi, 🇿🇦 Johannesburg, 🇲🇦 Casablanca, 🇬🇭 Accra |
| Europe | 🇷🇺 Moscow, 🇹🇷 Istanbul, 🇬🇷 Athens, 🇩🇪 Berlin, 🇫🇷 Paris, 🇵🇱 Warsaw, 🇬🇧 London, 🇵🇹 Lisbon |
| South America | 🇦🇷 Buenos Aires, 🇧🇷 São Paulo, 🇨🇴 Bogotá, 🇵🇪 Lima, 🇨🇱 Santiago |
| Central America | 🇲🇽 Mexico City |
| North America | 🇺🇸 New York, 🇨🇦 Toronto, 🇺🇸 Chicago, 🇺🇸 Denver, 🇺🇸 Los Angeles, 🇨🇦 Vancouver, 🇺🇸 Anchorage |

---

## 🛠 Tech Stack

- **Chrome Manifest V3** — Modern extension manifest
- **Vanilla JS** — No frameworks or build tools
- **Intl.DateTimeFormat API** — Timezone-aware formatting
- **navigator.clipboard API** — Modern copy with fallback
- **chrome.storage.sync** — Cross-device settings sync
- **chrome.contextMenus** — Right-click integration
- **BigInt** — Nanosecond timestamp parsing
- **CSS Custom Properties** — Light/dark theme switching

---

## 📄 License

Free to use and modify.

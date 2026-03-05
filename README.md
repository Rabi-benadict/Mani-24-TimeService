[README.md](https://github.com/user-attachments/files/25760378/README.md)
# 🕐 Time Converter — Chrome Extension

A powerful Chrome extension for converting timestamps and viewing world clocks across 20 time zones. Built with vanilla JavaScript, HTML, and CSS — no frameworks, no dependencies.

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

## 🚀 Installation

1. Clone or download this folder
2. Open Chrome → `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → Select the `TimeConverter` folder
5. Pin the extension to your toolbar for quick access

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

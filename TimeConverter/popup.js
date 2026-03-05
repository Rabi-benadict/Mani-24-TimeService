// ============================================================
// Time Converter — Chrome Extension
// ============================================================

// --- Time Zone Data ---
const ALL_ZONES = [
    // Oceania & Pacific
    { id: 'Pacific/Auckland', label: 'Auckland', flag: '🇳🇿' },
    { id: 'Pacific/Fiji', label: 'Fiji', flag: '🇫🇯' },
    { id: 'Pacific/Honolulu', label: 'Honolulu', flag: '🇺🇸' },

    // Australia
    { id: 'Australia/Sydney', label: 'Sydney', flag: '🇦🇺' },
    { id: 'Australia/Perth', label: 'Perth', flag: '🇦🇺' },

    // East Asia
    { id: 'Asia/Tokyo', label: 'Tokyo', flag: '🇯🇵' },
    { id: 'Asia/Seoul', label: 'Seoul', flag: '🇰🇷' },
    { id: 'Asia/Shanghai', label: 'Shanghai', flag: '🇨🇳' },
    { id: 'Asia/Hong_Kong', label: 'Hong Kong', flag: '🇭🇰' },

    // Southeast Asia
    { id: 'Asia/Singapore', label: 'Singapore', flag: '🇸🇬' },
    { id: 'Asia/Bangkok', label: 'Bangkok', flag: '🇹🇭' },
    { id: 'Asia/Jakarta', label: 'Jakarta', flag: '🇮🇩' },
    { id: 'Asia/Manila', label: 'Manila', flag: '🇵🇭' },

    // South Asia
    { id: 'Asia/Kolkata', label: 'India (IST)', flag: '🇮🇳' },
    { id: 'Asia/Dhaka', label: 'Dhaka', flag: '🇧🇩' },
    { id: 'Asia/Karachi', label: 'Karachi', flag: '🇵🇰' },

    // Central Asia
    { id: 'Asia/Almaty', label: 'Almaty', flag: '🇰🇿' },

    // Middle East
    { id: 'Asia/Dubai', label: 'Dubai', flag: '🇦🇪' },
    { id: 'Asia/Riyadh', label: 'Riyadh', flag: '🇸🇦' },
    { id: 'Asia/Tehran', label: 'Tehran', flag: '🇮🇷' },

    // Africa
    { id: 'Africa/Cairo', label: 'Cairo', flag: '🇪🇬' },
    { id: 'Africa/Lagos', label: 'Lagos', flag: '🇳🇬' },
    { id: 'Africa/Nairobi', label: 'Nairobi', flag: '🇰🇪' },
    { id: 'Africa/Johannesburg', label: 'Johannesburg', flag: '🇿🇦' },
    { id: 'Africa/Casablanca', label: 'Casablanca', flag: '🇲🇦' },
    { id: 'Africa/Accra', label: 'Accra', flag: '🇬🇭' },

    // Europe
    { id: 'Europe/Moscow', label: 'Moscow', flag: '🇷🇺' },
    { id: 'Europe/Istanbul', label: 'Istanbul', flag: '🇹🇷' },
    { id: 'Europe/Athens', label: 'Athens', flag: '🇬🇷' },
    { id: 'Europe/Berlin', label: 'Berlin', flag: '🇩🇪' },
    { id: 'Europe/Paris', label: 'Paris', flag: '🇫🇷' },
    { id: 'Europe/Warsaw', label: 'Warsaw', flag: '🇵🇱' },
    { id: 'Europe/London', label: 'London', flag: '🇬🇧' },
    { id: 'Europe/Lisbon', label: 'Lisbon', flag: '🇵🇹' },

    // South America
    { id: 'America/Buenos_Aires', label: 'Buenos Aires', flag: '🇦🇷' },
    { id: 'America/Sao_Paulo', label: 'São Paulo', flag: '🇧🇷' },
    { id: 'America/Bogota', label: 'Bogotá', flag: '🇨🇴' },
    { id: 'America/Lima', label: 'Lima', flag: '🇵🇪' },
    { id: 'America/Santiago', label: 'Santiago', flag: '🇨🇱' },

    // Central America & Caribbean
    { id: 'America/Mexico_City', label: 'Mexico City', flag: '🇲🇽' },

    // North America
    { id: 'America/New_York', label: 'New York', flag: '🇺🇸' },
    { id: 'America/Toronto', label: 'Toronto', flag: '🇨🇦' },
    { id: 'America/Chicago', label: 'Chicago', flag: '🇺🇸' },
    { id: 'America/Denver', label: 'Denver', flag: '🇺🇸' },
    { id: 'America/Los_Angeles', label: 'Los Angeles', flag: '🇺🇸' },
    { id: 'America/Vancouver', label: 'Vancouver', flag: '🇨🇦' },
    { id: 'America/Anchorage', label: 'Anchorage', flag: '🇺🇸' },
];

const DEFAULT_ZONES = [
    'America/New_York',
    'Europe/London',
    'Asia/Kolkata',
    'Asia/Tokyo',
];

const STORAGE_KEY = 'tc_selected_zones';
const PINNED_KEY = 'tc_pinned_zones';

const DEFAULT_PINNED = [
    'America/New_York',
    'Europe/London',
    'Asia/Kolkata',
    'Asia/Tokyo',
];

const HISTORY_KEY = 'tc_history';
const THEME_KEY = 'tc_theme';
const MAX_HISTORY = 10;

// --- State ---
let selectedZones = [];
let pinnedZones = [];
let collapsedVisible = false;
let clockInterval = null;
let lastConvertedDate = null;

// --- Storage Helpers (chrome.storage.sync with fallback) ---
async function storageGet(key, defaultValue) {
    return new Promise(resolve => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(key, (result) => {
                resolve(result[key] !== undefined ? result[key] : defaultValue);
            });
        } else {
            try {
                const val = localStorage.getItem(key);
                resolve(val ? JSON.parse(val) : defaultValue);
            } catch (_) {
                resolve(defaultValue);
            }
        }
    });
}

function storageSet(key, value) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ [key]: value });
    }
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* ignore */ }
}

// --- Helpers ---
async function loadSelectedZones() {
    const stored = await storageGet(STORAGE_KEY, null);
    if (Array.isArray(stored) && stored.length > 0) {
        selectedZones = stored.filter(id => ALL_ZONES.some(z => z.id === id));
        if (selectedZones.length > 0) return;
    }
    selectedZones = [...DEFAULT_ZONES];
}

function saveSelectedZones() {
    storageSet(STORAGE_KEY, selectedZones);
}

async function loadPinnedZones() {
    const stored = await storageGet(PINNED_KEY, null);
    if (Array.isArray(stored) && stored.length > 0) {
        pinnedZones = stored.filter(id => ALL_ZONES.some(z => z.id === id));
        if (pinnedZones.length > 0) return;
    }
    pinnedZones = [...DEFAULT_PINNED];
}

function savePinnedZones() {
    storageSet(PINNED_KEY, pinnedZones);
}

function getZoneMeta(zoneId) {
    return ALL_ZONES.find(z => z.id === zoneId) || { id: zoneId, label: zoneId, flag: '🌐' };
}

function formatTime(date, timeZone) {
    return date.toLocaleTimeString('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

function formatDate(date, timeZone) {
    return date.toLocaleDateString('en-US', {
        timeZone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function getNumericOffset(date, timeZone) {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (tzDate - utcDate) / 60000;
}

function isDST(date, timeZone) {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    const janOff = getNumericOffset(jan, timeZone);
    const julOff = getNumericOffset(jul, timeZone);
    if (janOff === julOff) return false;
    const curOff = getNumericOffset(date, timeZone);
    return curOff !== Math.min(janOff, julOff);
}

function dstBadge(date, timeZone) {
    return isDST(date, timeZone) ? ' <span class="dst-badge">DST</span>' : '';
}

function getOffsetLabel(date, timeZone) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset',
    }).formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
}

// --- Copy Helpers ---
function showToast(message = 'Copied to clipboard!') {
    const toast = document.getElementById('copy-toast');
    const msgEl = document.getElementById('toast-message');
    msgEl.textContent = message;
    toast.classList.remove('hidden');
    // Force reflow for animation
    void toast.offsetWidth;
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 1800);
}

async function copyToClipboard(text, toastMsg) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(toastMsg || 'Copied to clipboard!');
    } catch (_) {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(toastMsg || 'Copied!');
    }
}

function formatZoneForCopy(zone, date) {
    const meta = getZoneMeta(zone.id || zone);
    const zoneId = zone.id || zone;
    return {
        label: meta.label,
        flag: meta.flag,
        time: formatTime(date, zoneId),
        date: formatDate(date, zoneId),
        offset: getOffsetLabel(date, zoneId),
    };
}

function buildCopyText(zones, date, format) {
    const entries = zones.map(z => formatZoneForCopy(z, date));

    switch (format) {
        case 'table': {
            const maxLabel = Math.max(...entries.map(e => e.label.length), 8);
            const lines = entries.map(e =>
                `${e.date}  ${e.time}  ${e.flag} ${e.label.padEnd(maxLabel)}  (${e.offset})`
            );
            return lines.join('\n');
        }
        case 'inline': {
            return entries.map(e => `${e.date}, ${e.time} — ${e.label}`).join('  |  ');
        }
        case 'slack': {
            return entries.map(e => `${e.date}, \`${e.time}\` — *${e.label}* (${e.offset})`).join('\n');
        }
        case 'csv': {
            const header = 'Date,Time,Zone,Offset';
            const rows = entries.map(e => `"${e.date}","${e.time}","${e.label}","${e.offset}"`);
            return [header, ...rows].join('\n');
        }
        default:
            return entries.map(e => `${e.date}, ${e.time} — ${e.label}`).join('\n');
    }
}

function getSelectedCopyFormat() {
    const sel = document.getElementById('copy-format');
    return sel ? sel.value : 'table';
}

// --- Tabs ---
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
}

// --- World Clocks ---
function renderClocks() {
    const now = new Date();

    // Local time
    document.getElementById('local-time').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('local-zone').textContent =
        `${localTz.replace(/_/g, ' ')}  •  ${getOffsetLabel(now, localTz)}`;

    // World clocks
    const grid = document.getElementById('world-clocks');
    grid.innerHTML = '';

    selectedZones.forEach(zoneId => {
        const meta = getZoneMeta(zoneId);
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.innerHTML = `
      <div>
        <div class="city">${meta.flag} ${meta.label}${dstBadge(now, zoneId)}</div>
        <div class="tz-abbr">${getOffsetLabel(now, zoneId)}</div>
      </div>
      <div class="clock-right">
        <div class="clock-time">${formatTime(now, zoneId)}</div>
        <div class="clock-date">${formatDate(now, zoneId)}</div>
      </div>
      <button class="remove-btn" data-zone="${zoneId}" title="Remove">&times;</button>
    `;
        grid.appendChild(card);
    });

    // Remove handlers
    grid.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedZones = selectedZones.filter(z => z !== btn.dataset.zone);
            saveSelectedZones();
            renderClocks();
            populateAddZoneDropdown();
        });
    });
}

function startClock() {
    renderClocks();
    clockInterval = setInterval(renderClocks, 1000);
}

// --- Add Zone Dropdown ---
function populateAddZoneDropdown() {
    const select = document.getElementById('add-zone-select');
    select.innerHTML = '<option value="">+ Add a time zone…</option>';

    ALL_ZONES
        .filter(z => !selectedZones.includes(z.id))
        .forEach(z => {
            const opt = document.createElement('option');
            opt.value = z.id;
            opt.textContent = `${z.flag}  ${z.label}`;
            select.appendChild(opt);
        });
}

function initAddZone() {
    const select = document.getElementById('add-zone-select');
    select.addEventListener('change', () => {
        const val = select.value;
        if (!val) return;
        selectedZones.push(val);
        saveSelectedZones();
        renderClocks();
        populateAddZoneDropdown();
    });
}

// --- Smart Auto-Detect Parser ---
function smartParse(input) {
    const s = input.trim();
    if (!s) return null;

    // 1. Nanoseconds (19 digits)
    if (/^\d{16,19}$/.test(s)) {
        const ns = BigInt(s);
        const ms = Number(ns / 1000000n);
        const d = new Date(ms);
        if (!isNaN(d.getTime()) && d.getFullYear() > 1970 && d.getFullYear() < 2100) {
            return { date: d, format: 'Nanoseconds' };
        }
    }

    // 2. Microseconds (16 digits)
    if (/^\d{15,16}$/.test(s)) {
        const us = Number(s);
        const ms = Math.floor(us / 1000);
        const d = new Date(ms);
        if (!isNaN(d.getTime()) && d.getFullYear() > 1970 && d.getFullYear() < 2100) {
            return { date: d, format: 'Microseconds' };
        }
    }

    // 3. Milliseconds (13 digits)
    if (/^\d{12,14}$/.test(s)) {
        const d = new Date(Number(s));
        if (!isNaN(d.getTime()) && d.getFullYear() > 1970 && d.getFullYear() < 2100) {
            return { date: d, format: 'Milliseconds (Unix ms)' };
        }
    }

    // 4. Epoch seconds (10 digits, possibly with decimal)
    if (/^\d{9,11}(\.\d+)?$/.test(s)) {
        const d = new Date(parseFloat(s) * 1000);
        if (!isNaN(d.getTime()) && d.getFullYear() > 1970 && d.getFullYear() < 2100) {
            return { date: d, format: 'Epoch (Unix seconds)' };
        }
    }

    // 5. ISO 8601: 2026-03-03T14:30:00Z or 2026-03-03T14:30:00+05:30
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/i.test(s)) {
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'ISO 8601' };
        }
    }

    // 6. RFC 2822: Tue, 03 Mar 2026 14:30:00 +0530
    if (/^[A-Za-z]{3},?\s+\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}/.test(s)) {
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'RFC 2822' };
        }
    }

    // 7. Date with dashes (no time): 2026-03-03
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const d = new Date(s + 'T00:00:00');
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'Date (YYYY-MM-DD)' };
        }
    }

    // 8. Date with slashes: MM/DD/YYYY or DD/MM/YYYY
    const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
        const [, a, b, year] = slashMatch;
        // Try MM/DD/YYYY first (US format)
        let d = new Date(`${year}-${a.padStart(2, '0')}-${b.padStart(2, '0')}T00:00:00`);
        if (!isNaN(d.getTime()) && d.getMonth() + 1 === Number(a)) {
            return { date: d, format: 'Date (MM/DD/YYYY)' };
        }
        // Try DD/MM/YYYY (EU format)
        d = new Date(`${year}-${b.padStart(2, '0')}-${a.padStart(2, '0')}T00:00:00`);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'Date (DD/MM/YYYY)' };
        }
    }

    // 9. Date with dots: DD.MM.YYYY
    const dotMatch = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (dotMatch) {
        const [, day, month, year] = dotMatch;
        const d = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'Date (DD.MM.YYYY)' };
        }
    }

    // 9b. DD-MM-YYYY with optional time: "26-02-2026", "26-02-2026 00:39:57", "26-02-2026 00:39:57:274"
    const dashDMY = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})(?:[\s,]+(.+))?$/);
    if (dashDMY) {
        const [, a, b, year, timePart] = dashDMY;
        let normTime = '00:00:00';
        if (timePart) {
            let t = timePart.trim();
            // Handle milliseconds separated by colon: HH:mm:ss:SSS → HH:mm:ss.SSS
            t = t.replace(/^(\d{2}:\d{2}:\d{2}):(\d{1,3})$/, '$1.$2');
            const ampmM = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?\s*(AM|PM)$/i);
            if (ampmM) {
                let h = parseInt(ampmM[1]);
                const mm = ampmM[2];
                const ss = ampmM[3] || '00';
                const ap = ampmM[5].toUpperCase();
                if (ap === 'PM' && h < 12) h += 12;
                if (ap === 'AM' && h === 12) h = 0;
                normTime = `${String(h).padStart(2, '0')}:${mm}:${ss}`;
            } else if (/^\d{1,2}:\d{2}(:\d{2})?(\.\d+)?$/.test(t)) {
                normTime = t.split(':').length === 2 ? t + ':00' : t;
            }
        }
        // Try DD/MM/YYYY
        let d = new Date(`${year}-${b.padStart(2, '0')}-${a.padStart(2, '0')}T${normTime}`);
        if (!isNaN(d.getTime()) && d.getMonth() + 1 === Number(b)) {
            return { date: d, format: timePart ? 'DateTime (DD-MM-YYYY time)' : 'Date (DD-MM-YYYY)' };
        }
        // Try MM/DD/YYYY
        d = new Date(`${year}-${a.padStart(2, '0')}-${b.padStart(2, '0')}T${normTime}`);
        if (!isNaN(d.getTime()) && d.getMonth() + 1 === Number(a)) {
            return { date: d, format: timePart ? 'DateTime (MM-DD-YYYY time)' : 'Date (MM-DD-YYYY)' };
        }
    }

    // 10. Human natural: Mar 3, 2026 2:30 PM  or  March 3, 2026 14:30
    if (/^[A-Za-z]+\s+\d{1,2},?\s+\d{4}/i.test(s)) {
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'Human Date' };
        }
    }

    // 11. "3 Mar 2026" or "03 March 2026 14:30:00"
    if (/^\d{1,2}\s+[A-Za-z]+\s+\d{4}/i.test(s)) {
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'Human Date' };
        }
    }

    // 12. Date + time with space separator: "2026-03-03 14:30:00" or "2026-03-03 14:30:00+05:30"
    const dtSpaceMatch = s.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(:\d{2})?(.*))$/);
    if (dtSpaceMatch) {
        const isoStr = `${dtSpaceMatch[1]}T${dtSpaceMatch[2]}`;
        const d = new Date(isoStr);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'DateTime (YYYY-MM-DD HH:mm:ss)' };
        }
    }

    // 13. Time only: HH:mm or HH:mm:ss or h:mm AM/PM — assume today
    const timeOnlyMatch = s.match(/^(\d{1,2}:\d{2}(:\d{2})?)\s*(AM|PM)?$/i);
    if (timeOnlyMatch) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        let timeStr = timeOnlyMatch[1];
        const ampm = timeOnlyMatch[3];
        if (ampm) {
            // Convert 12-hour to 24-hour
            let [h, ...rest] = timeStr.split(':');
            h = parseInt(h);
            if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
            if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
            timeStr = [String(h).padStart(2, '0'), ...rest].join(':');
        }
        const d = new Date(`${dateStr}T${timeStr}`);
        if (!isNaN(d.getTime())) {
            return { date: d, format: 'Time Only (today)' };
        }
    }

    // 14. Relative time: "2 hours ago", "in 30 minutes", "5 days ago", "in 1 week"
    const relAgoMatch = s.match(/^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i);
    if (relAgoMatch) {
        const amount = parseInt(relAgoMatch[1]);
        const unit = relAgoMatch[2].toLowerCase();
        const d = applyRelativeTime(new Date(), -amount, unit);
        if (d) return { date: d, format: `Relative (${amount} ${unit}${amount > 1 ? 's' : ''} ago)` };
    }

    const relInMatch = s.match(/^in\s+(\d+)\s+(second|minute|hour|day|week|month|year)s?$/i);
    if (relInMatch) {
        const amount = parseInt(relInMatch[1]);
        const unit = relInMatch[2].toLowerCase();
        const d = applyRelativeTime(new Date(), amount, unit);
        if (d) return { date: d, format: `Relative (in ${amount} ${unit}${amount > 1 ? 's' : ''})` };
    }

    // 15. Slash date with time: "03/03/2026 14:30" or "3/3/2026 2:30 PM" or "26/02/2026 15:11:58" or "26/02/2026, 15:11:59"
    const slashTimeMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(.+)$/);
    if (slashTimeMatch) {
        const [, a, b, year, timePart] = slashTimeMatch;
        // Parse timePart (handle AM/PM)
        let normTime = timePart.trim();
        const ampmMatch = normTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
        if (ampmMatch) {
            let h = parseInt(ampmMatch[1]);
            const mm = ampmMatch[2];
            const ss = ampmMatch[3] || '00';
            const ap = ampmMatch[4].toUpperCase();
            if (ap === 'PM' && h < 12) h += 12;
            if (ap === 'AM' && h === 12) h = 0;
            normTime = `${String(h).padStart(2, '0')}:${mm}:${ss}`;
        } else if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(normTime)) {
            // Already 24-hour, ensure seconds
            if (normTime.split(':').length === 2) normTime += ':00';
        }
        // Try MM/DD/YYYY first
        let dSlash = new Date(`${year}-${a.padStart(2, '0')}-${b.padStart(2, '0')}T${normTime}`);
        if (!isNaN(dSlash.getTime()) && dSlash.getMonth() + 1 === Number(a)) {
            return { date: dSlash, format: 'DateTime (MM/DD/YYYY time)' };
        }
        // Try DD/MM/YYYY
        dSlash = new Date(`${year}-${b.padStart(2, '0')}-${a.padStart(2, '0')}T${normTime}`);
        if (!isNaN(dSlash.getTime()) && dSlash.getMonth() + 1 === Number(b)) {
            return { date: dSlash, format: 'DateTime (DD/MM/YYYY time)' };
        }
    }

    // 16. Fallback: try native Date.parse
    const fallback = new Date(s);
    if (!isNaN(fallback.getTime())) {
        return { date: fallback, format: 'Auto-detected' };
    }

    return null;
}

function applyRelativeTime(base, amount, unit) {
    const d = new Date(base);
    switch (unit) {
        case 'second': d.setSeconds(d.getSeconds() + amount); break;
        case 'minute': d.setMinutes(d.getMinutes() + amount); break;
        case 'hour': d.setHours(d.getHours() + amount); break;
        case 'day': d.setDate(d.getDate() + amount); break;
        case 'week': d.setDate(d.getDate() + amount * 7); break;
        case 'month': d.setMonth(d.getMonth() + amount); break;
        case 'year': d.setFullYear(d.getFullYear() + amount); break;
        default: return null;
    }
    return d;
}

// --- Converter ---
let activeInputType = 'smart';

function populateZoneSelect(selectEl) {
    selectEl.innerHTML = '';
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const localInList = ALL_ZONES.some(z => z.id === localTz);
    if (!localInList) {
        const opt = document.createElement('option');
        opt.value = localTz;
        opt.textContent = `🌐  ${localTz.replace(/_/g, ' ')} (Local)`;
        selectEl.appendChild(opt);
    }

    ALL_ZONES.forEach(z => {
        const opt = document.createElement('option');
        opt.value = z.id;
        opt.textContent = `${z.flag}  ${z.label}`;
        if (z.id === localTz) opt.selected = true;
        selectEl.appendChild(opt);
    });
}

function setDefaultValues() {
    const now = new Date();
    document.getElementById('input-millis').value = now.getTime();
    document.getElementById('input-epoch').value = Math.floor(now.getTime() / 1000);

    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('input-date').value = dateStr;
    document.getElementById('input-dt-date').value = dateStr;
    document.getElementById('input-dt-time').value = timeStr;
}

function switchInputType(type) {
    activeInputType = type;

    // Update pills
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    document.querySelector(`.pill[data-type="${type}"]`).classList.add('active');

    // Toggle panels
    document.querySelectorAll('.input-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(`panel-${type}`).classList.remove('hidden');

    // Clear previous results
    document.getElementById('conversion-results').innerHTML = '';
    document.getElementById('parsed-info').classList.add('hidden');

    // Hide detected format badge
    const det = document.getElementById('detected-format');
    if (det) { det.classList.add('hidden'); det.classList.remove('success', 'error'); }
}

function parseDateFromInput() {
    switch (activeInputType) {
        case 'smart': {
            const val = document.getElementById('input-smart').value;
            const det = document.getElementById('detected-format');
            const result = smartParse(val);
            if (result) {
                det.innerHTML = `✓ Detected: <span class="format-badge">${result.format}</span>`;
                det.classList.remove('hidden', 'error');
                det.classList.add('success');
                return result.date;
            } else {
                if (val.trim()) {
                    det.innerHTML = '✗ Could not detect format';
                    det.classList.remove('hidden', 'success');
                    det.classList.add('error');
                } else {
                    det.classList.add('hidden');
                }
                return null;
            }
        }
        case 'millis': {
            const val = document.getElementById('input-millis').value.trim();
            if (!val || isNaN(Number(val))) return null;
            return new Date(Number(val));
        }
        case 'epoch': {
            const val = document.getElementById('input-epoch').value.trim();
            if (!val || isNaN(Number(val))) return null;
            return new Date(Number(val) * 1000);
        }
        case 'date': {
            const dateVal = document.getElementById('input-date').value;
            const zone = document.getElementById('input-zone-date').value;
            if (!dateVal) return null;
            // Treat as start of day in selected zone
            const dateTimeStr = `${dateVal}T00:00:00`;
            const localDate = new Date(dateTimeStr);
            const sourceInLocal = new Date(localDate.toLocaleString('en-US', { timeZone: zone }));
            const diff = localDate - sourceInLocal;
            return new Date(localDate.getTime() + diff);
        }
        case 'datetime': {
            const dateVal = document.getElementById('input-dt-date').value;
            const timeVal = document.getElementById('input-dt-time').value;
            const zone = document.getElementById('input-zone-datetime').value;
            if (!dateVal || !timeVal) return null;
            const dateTimeStr = `${dateVal}T${timeVal}`;
            const localDate = new Date(dateTimeStr);
            const sourceInLocal = new Date(localDate.toLocaleString('en-US', { timeZone: zone }));
            const diff = localDate - sourceInLocal;
            return new Date(localDate.getTime() + diff);
        }
        default:
            return null;
    }
}

function renderParsedInfo(date) {
    const card = document.getElementById('parsed-info');
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const values = [
        { label: 'Millis', value: String(date.getTime()) },
        { label: 'Epoch (s)', value: String(Math.floor(date.getTime() / 1000)) },
        { label: 'UTC', value: date.toISOString() },
        { label: `Local (${localTz.replace(/_/g, ' ')})`, value: `${formatDate(date, localTz)} ${formatTime(date, localTz)}` },
    ];

    card.innerHTML = values.map(v => `
        <div class="info-row">
            <span class="info-label">${v.label}</span>
            <span class="info-value" data-copy-value="${v.value}" title="Click to copy">${v.value}</span>
        </div>
    `).join('');
    card.classList.remove('hidden');

    // Click-to-copy on info values
    card.querySelectorAll('.info-value').forEach(el => {
        el.addEventListener('click', () => {
            const val = el.getAttribute('data-copy-value');
            copyToClipboard(val, `Copied: ${val.length > 30 ? val.slice(0, 30) + '\u2026' : val}`);
            el.classList.add('copied');
            setTimeout(() => el.classList.remove('copied'), 1200);
        });
    });
}

function doConvert() {
    const actualDate = parseDateFromInput();
    if (!actualDate || isNaN(actualDate.getTime())) {
        document.getElementById('conversion-results').innerHTML =
            '<div class="result-row" style="justify-content:center;color:#ef4444;">Invalid input \u2014 please check your value.</div>';
        document.getElementById('parsed-info').classList.add('hidden');
        document.getElementById('pinned-zones-selector').classList.add('hidden');
        document.getElementById('toggle-collapsed').classList.add('hidden');
        return;
    }

    // Show parsed info
    renderParsedInfo(actualDate);
    lastConvertedDate = actualDate;

    // Save to history
    if (activeInputType === 'smart') {
        const histInput = document.getElementById('input-smart').value.trim();
        if (histInput) {
            const detected = smartParse(histInput);
            saveToHistory(histInput, detected ? detected.format : 'Manual', actualDate);
        }
    }

    // Show pinned selector, copy actions & search bar
    document.getElementById('pinned-zones-selector').classList.remove('hidden');
    document.getElementById('copy-actions').classList.remove('hidden');
    document.getElementById('results-search-bar').classList.remove('hidden');
    const searchInput = document.getElementById('results-search');
    searchInput.value = '';

    // Split zones into pinned and others
    const pinned = ALL_ZONES.filter(z => pinnedZones.includes(z.id));
    const others = ALL_ZONES.filter(z => !pinnedZones.includes(z.id));

    // Render results
    const results = document.getElementById('conversion-results');
    results.innerHTML = '';

    // --- Pinned (expanded) ---
    pinned.forEach(z => {
        const row = document.createElement('div');
        row.className = 'result-row expanded';
        row.innerHTML = `
      <div>
        <div class="result-zone">${z.flag} ${z.label}${dstBadge(actualDate, z.id)}</div>
        <div class="result-offset">${getOffsetLabel(actualDate, z.id)}</div>
      </div>
      <div class="clock-right">
        <div class="result-time">${formatTime(actualDate, z.id)}</div>
        <div class="result-date">${formatDate(actualDate, z.id)}</div>
      </div>
      <button class="result-copy-btn" data-zone-id="${z.id}" title="Copy this time">📋</button>
    `;
        row.querySelector('.result-copy-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const text = `${formatDate(actualDate, z.id)}, ${formatTime(actualDate, z.id)} — ${z.flag} ${z.label} (${getOffsetLabel(actualDate, z.id)})`;
            copyToClipboard(text, `Copied ${z.label} time`);
            const btn = row.querySelector('.result-copy-btn');
            btn.textContent = '\u2713';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = '\ud83d\udccb'; btn.classList.remove('copied'); }, 1500);
        });
        results.appendChild(row);
    });

    // --- Divider ---
    if (others.length > 0) {
        const divider = document.createElement('div');
        divider.className = 'results-divider';
        divider.textContent = `${others.length} more zones`;
        results.appendChild(divider);

        // --- Others (collapsed initially) ---
        others.forEach(z => {
            const row = document.createElement('div');
            row.className = 'result-row collapsed';
            row.setAttribute('data-zone-id', z.id);
            row.innerHTML = `
        <div>
          <div class="result-zone">${z.flag} ${z.label}${dstBadge(actualDate, z.id)}</div>
          <div class="result-offset">${getOffsetLabel(actualDate, z.id)}</div>
        </div>
        <div class="clock-right">
          <div class="result-time">${formatTime(actualDate, z.id)}</div>
          <div class="result-date">${formatDate(actualDate, z.id)}</div>
        </div>
        <button class="result-copy-btn" data-zone-id="${z.id}" title="Copy this time">📋</button>
      `;
            // Click to expand individual row
            row.addEventListener('click', (e) => {
                if (e.target.closest('.result-copy-btn')) return;
                if (row.classList.contains('collapsed')) {
                    row.classList.remove('collapsed');
                    row.classList.add('expanded');
                } else {
                    row.classList.remove('expanded');
                    row.classList.add('collapsed');
                    row.classList.add('visible');
                }
            });
            row.querySelector('.result-copy-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const text = `${formatDate(actualDate, z.id)}, ${formatTime(actualDate, z.id)} — ${z.flag} ${z.label} (${getOffsetLabel(actualDate, z.id)})`;
                copyToClipboard(text, `Copied ${z.label} time`);
                const btn = row.querySelector('.result-copy-btn');
                btn.textContent = '\u2713';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = '\ud83d\udccb'; btn.classList.remove('copied'); }, 1500);
            });
            results.appendChild(row);
        });

        // Toggle button
        const toggleBtn = document.getElementById('toggle-collapsed');
        collapsedVisible = false;
        toggleBtn.classList.remove('hidden');
        toggleBtn.textContent = `▼ Show all ${others.length} zones`;
        toggleBtn.onclick = () => {
            collapsedVisible = !collapsedVisible;
            const otherRows = results.querySelectorAll('.result-row[data-zone-id]');

            if (collapsedVisible) {
                // Show all others as expanded
                otherRows.forEach(r => {
                    r.classList.remove('collapsed');
                    r.classList.remove('visible');
                    r.classList.add('expanded');
                });
                toggleBtn.textContent = '▲ Collapse others';
            } else {
                // Collapse and hide all others
                otherRows.forEach(r => {
                    r.classList.remove('expanded');
                    r.classList.remove('visible');
                    r.classList.add('collapsed');
                });
                toggleBtn.textContent = `▼ Show all ${others.length} zones`;
            }
        };
    } else {
        document.getElementById('toggle-collapsed').classList.add('hidden');
    }

    // Wire results search filter
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        results.querySelectorAll('.result-row').forEach(row => {
            const zone = row.querySelector('.result-zone');
            if (!zone) return;
            const text = zone.textContent.toLowerCase();
            if (!q || text.includes(q)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        // Also filter the divider visibility
        const divider = results.querySelector('.results-divider');
        if (divider) divider.style.display = q ? 'none' : '';
    });
}

// --- Pinned Zones UI ---
function renderPinnedCheckboxes() {
    const container = document.getElementById('pinned-checkboxes');
    container.innerHTML = '';

    ALL_ZONES.forEach(z => {
        const chip = document.createElement('label');
        chip.className = `pin-chip${pinnedZones.includes(z.id) ? ' selected' : ''}`;
        chip.innerHTML = `
            <input type="checkbox" value="${z.id}" ${pinnedZones.includes(z.id) ? 'checked' : ''} />
            <span class="pin-icon">📌</span>
            ${z.flag} ${z.label}
        `;
        chip.querySelector('input').addEventListener('change', (e) => {
            if (e.target.checked) {
                pinnedZones.push(z.id);
                chip.classList.add('selected');
            } else {
                pinnedZones = pinnedZones.filter(id => id !== z.id);
                chip.classList.remove('selected');
            }
            savePinnedZones();
            // Re-render results if visible
            const results = document.getElementById('conversion-results');
            if (results.children.length > 0) {
                doConvert();
            }
        });
        container.appendChild(chip);
    });
}

function initPinnedZones() {
    const editBtn = document.getElementById('pinned-edit-btn');
    const editPanel = document.getElementById('pinned-edit-panel');

    editBtn.addEventListener('click', () => {
        editPanel.classList.toggle('hidden');
        editBtn.classList.toggle('active');
        editBtn.textContent = editPanel.classList.contains('hidden') ? 'Edit' : 'Done';
    });

    // Search filter for pinned zones
    const searchInput = document.getElementById('pinned-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase().trim();
            document.querySelectorAll('.pin-chip').forEach(chip => {
                chip.style.display = chip.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }

    renderPinnedCheckboxes();
}

function initConverter() {
    // Populate all zone selects
    populateZoneSelect(document.getElementById('input-zone-date'));
    populateZoneSelect(document.getElementById('input-zone-datetime'));

    setDefaultValues();

    // Input type pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => switchInputType(pill.dataset.type));
    });

    // "Now" buttons
    document.getElementById('btn-now-millis').addEventListener('click', () => {
        document.getElementById('input-millis').value = Date.now();
    });
    document.getElementById('btn-now-epoch').addEventListener('click', () => {
        document.getElementById('input-epoch').value = Math.floor(Date.now() / 1000);
    });

    // Smart Paste — live detection as user types/pastes
    const smartInput = document.getElementById('input-smart');
    let smartDebounce = null;
    smartInput.addEventListener('input', () => {
        clearTimeout(smartDebounce);
        smartDebounce = setTimeout(() => {
            const det = document.getElementById('detected-format');
            const val = smartInput.value;
            const result = smartParse(val);
            if (result) {
                det.innerHTML = `✓ Detected: <span class="format-badge">${result.format}</span>`;
                det.classList.remove('hidden', 'error');
                det.classList.add('success');
            } else if (val.trim()) {
                det.innerHTML = '✗ Could not detect format';
                det.classList.remove('hidden', 'success');
                det.classList.add('error');
            } else {
                det.classList.add('hidden');
            }
        }, 300);
    });

    // Convert on Enter key in smart paste
    smartInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            doConvert();
        }
    });

    // Convert button
    document.getElementById('convert-btn').addEventListener('click', doConvert);

    // Copy action buttons
    document.getElementById('copy-pinned-btn').addEventListener('click', () => {
        if (!lastConvertedDate) return;
        const pinnedList = ALL_ZONES.filter(z => pinnedZones.includes(z.id));
        const text = buildCopyText(pinnedList, lastConvertedDate, getSelectedCopyFormat());
        copyToClipboard(text, `Copied ${pinnedList.length} pinned zones`);
    });

    document.getElementById('copy-all-btn').addEventListener('click', () => {
        if (!lastConvertedDate) return;
        const text = buildCopyText(ALL_ZONES, lastConvertedDate, getSelectedCopyFormat());
        copyToClipboard(text, `Copied all ${ALL_ZONES.length} zones`);
    });
}

// --- Theme ---
async function loadTheme() {
    const theme = await storageGet(THEME_KEY, 'dark');
    applyTheme(theme);
}

function applyTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        applyTheme(newTheme);
        storageSet(THEME_KEY, newTheme);
    });
}

// --- History ---
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

async function loadAndRenderHistory() {
    const history = await storageGet(HISTORY_KEY, []);
    renderHistory(history);
}

function saveToHistory(input, format, date) {
    storageGet(HISTORY_KEY, []).then(history => {
        history = history.filter(h => h.input !== input);
        history.unshift({ input, format, timestamp: date.getTime(), savedAt: Date.now() });
        if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
        storageSet(HISTORY_KEY, history);
        renderHistory(history);
    });
}

function renderHistory(history) {
    const container = document.getElementById('history-list');
    if (!container) return;
    if (!history || history.length === 0) {
        container.innerHTML = '<div class="history-empty">No recent conversions</div>';
        return;
    }
    container.innerHTML = history.map((h, i) => `
        <div class="history-item" data-index="${i}" title="Click to reconvert">
            <div class="history-input">${escapeHtml(h.input)}</div>
            <div class="history-meta">
                <span class="history-format">${escapeHtml(h.format)}</span>
                <span class="history-ago">${timeAgo(h.savedAt)}</span>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index'));
            const entry = history[idx];
            if (!entry) return;
            document.querySelector('.tab[data-tab="converter"]').click();
            switchInputType('smart');
            document.getElementById('input-smart').value = entry.input;
            doConvert();
        });
    });
}

function initHistory() {
    const header = document.getElementById('history-header');
    const list = document.getElementById('history-list');
    const toggle = document.getElementById('history-toggle');
    if (!header || !list) return;
    header.addEventListener('click', () => {
        list.classList.toggle('hidden');
        toggle.classList.toggle('open');
    });
}

// --- Time Diff Calculator ---
function initTimeDiff() {
    const btnDiff = document.getElementById('diff-btn');
    if (!btnDiff) return;

    ['diff-input-a', 'diff-input-b'].forEach((id, i) => {
        const el = document.getElementById(id);
        let debounce = null;
        el.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                const det = document.getElementById(i === 0 ? 'diff-detected-a' : 'diff-detected-b');
                const result = smartParse(el.value);
                if (result) {
                    det.innerHTML = `✓ Detected: <span class="format-badge">${result.format}</span>`;
                    det.classList.remove('hidden', 'error');
                    det.classList.add('success');
                } else if (el.value.trim()) {
                    det.innerHTML = '✗ Could not detect format';
                    det.classList.remove('hidden', 'success');
                    det.classList.add('error');
                } else {
                    det.classList.add('hidden');
                }
            }, 300);
        });
    });

    btnDiff.addEventListener('click', calculateDiff);
}

function calculateDiff() {
    const parsedA = smartParse(document.getElementById('diff-input-a').value);
    const parsedB = smartParse(document.getElementById('diff-input-b').value);
    const resultDiv = document.getElementById('diff-result');

    if (!parsedA || !parsedB) {
        resultDiv.innerHTML = '<div style="color:#ef4444;text-align:center;padding:12px;">Please enter two valid time values.</div>';
        resultDiv.classList.remove('hidden');
        return;
    }

    const diffMs = Math.abs(parsedB.date.getTime() - parsedA.date.getTime());
    const isAfter = parsedB.date >= parsedA.date;
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hr${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} min`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} sec`);

    resultDiv.innerHTML = `
        <div class="diff-summary">
            <div class="diff-direction">${isAfter ? '⏩ End is after Start' : '⏪ End is before Start'}</div>
            <div class="diff-duration">${parts.join(', ')}</div>
        </div>
        <div class="diff-details">
            <div class="diff-detail-row"><span class="diff-label">Milliseconds</span><span class="diff-value">${diffMs.toLocaleString()}</span></div>
            <div class="diff-detail-row"><span class="diff-label">Seconds</span><span class="diff-value">${totalSeconds.toLocaleString()}</span></div>
            <div class="diff-detail-row"><span class="diff-label">Hours</span><span class="diff-value">${(totalSeconds / 3600).toFixed(2)}</span></div>
            <div class="diff-detail-row"><span class="diff-label">Days</span><span class="diff-value">${(totalSeconds / 86400).toFixed(4)}</span></div>
        </div>
    `;
    resultDiv.classList.remove('hidden');
}

// --- Context Menu Input ---
async function checkContextInput() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) return;
    return new Promise(resolve => {
        chrome.storage.local.get('tc_context_input', (result) => {
            if (result.tc_context_input) {
                document.querySelector('.tab[data-tab="converter"]').click();
                switchInputType('smart');
                document.getElementById('input-smart').value = result.tc_context_input;
                doConvert();
                chrome.storage.local.remove('tc_context_input');
                try { chrome.action.setBadgeText({ text: '' }); } catch (_) { }
            }
            resolve();
        });
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadTheme();
    await loadSelectedZones();
    await loadPinnedZones();
    initTabs();
    startClock();
    populateAddZoneDropdown();
    initAddZone();
    initConverter();
    initPinnedZones();
    initThemeToggle();
    initTimeDiff();
    initHistory();
    await loadAndRenderHistory();
    await checkContextInput();
});

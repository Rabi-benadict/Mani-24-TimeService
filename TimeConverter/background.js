// ============================================================
// Time Converter — Background Service Worker
// ============================================================

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'convert-time',
        title: 'Convert "%s" with Time Converter',
        contexts: ['selection'],
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'convert-time' && info.selectionText) {
        chrome.storage.local.set({ tc_context_input: info.selectionText.trim() });
        chrome.action.setBadgeText({ text: '1' });
        chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' });
    }
});

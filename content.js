let excludeList = [];

function getChannelName(item) {
  const el = item.querySelector('a[href^="/@"], a[href*="/channel/"]');
  return el ? el.textContent.trim() : null;
}

function filterItems() {
  if (excludeList.length === 0) return;
  const items = document.querySelectorAll('ytd-rich-item-renderer');
  items.forEach(item => {
    const channel = getChannelName(item);
    if (!channel) return;
    const excluded = excludeList.some(name => name.toLowerCase() === channel.toLowerCase());
    item.style.display = excluded ? 'none' : '';
  });
}

let debounceTimer = null;
function debouncedFilter() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(filterItems, 300);
}

chrome.storage.sync.get('excludeList', ({ excludeList: stored }) => {
  excludeList = stored || [];
  filterItems();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.excludeList) {
    excludeList = changes.excludeList.newValue || [];
    filterItems();
  }
});

const observer = new MutationObserver(debouncedFilter);
observer.observe(document.body, { childList: true, subtree: true });

const input = document.getElementById('channel-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('channel-list');

function saveList(arr) {
  chrome.storage.sync.set({ excludeList: arr });
}

function renderList(arr) {
  list.innerHTML = '';
  if (arr.length === 0) {
    list.innerHTML = '<li class="empty">No channels excluded</li>';
    return;
  }
  arr.forEach((name, i) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = name;
    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.textContent = '×';
    btn.title = 'Remove';
    btn.addEventListener('click', () => {
      const updated = arr.filter((_, j) => j !== i);
      saveList(updated);
      renderList(updated);
    });
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function addChannel() {
  const name = input.value.trim();
  if (!name) return;
  chrome.storage.sync.get('excludeList', ({ excludeList }) => {
    const arr = excludeList || [];
    if (arr.some(n => n.toLowerCase() === name.toLowerCase())) {
      input.value = '';
      return;
    }
    const updated = [...arr, name];
    saveList(updated);
    renderList(updated);
    input.value = '';
  });
}

addBtn.addEventListener('click', addChannel);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addChannel(); });

chrome.storage.sync.get('excludeList', ({ excludeList }) => {
  renderList(excludeList || []);
});

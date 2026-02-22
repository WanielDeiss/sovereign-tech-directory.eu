'use strict';

(function () {
  const DEBOUNCE_MS = 200;
  const DESCRIPTION_MAX_LENGTH = 160;

  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');
  if (!input || !resultsEl) return;

  const indexUrl =
    resultsEl.getAttribute('data-index-url') || '/search-index.json';
  let fuse = null;
  let debounceTimer = null;
  const i18n = window.SEARCH_I18N ?? {
    noResults: 'No tools found.',
    loadError: 'Search could not be loaded. Please refresh the page.',
  };

  const escapeHtml = (str) => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const renderResults = (results) => {
  if (results.length === 0) {
    resultsEl.innerHTML = `<p class="search-no-js">${escapeHtml(i18n.noResults)}</p>`;
    return;
  }
  const items = results
    .map((r) => {
      const t = r.item !== undefined ? r.item : r;
      const desc =
        t.description?.length > DESCRIPTION_MAX_LENGTH
          ? `${t.description.slice(0, DESCRIPTION_MAX_LENGTH)}\u2026`
          : (t.description ?? '');
      const category = t.categoryLabel
        ? `<span class="category">${escapeHtml(t.categoryLabel)}</span>`
        : '';
      return `
<li class="card">
  <header>
    <h2 class="section-title"><a href="${escapeHtml(t.url)}" class="link">${escapeHtml(t.name)}</a></h2>
    ${category}
  </header>
  <p class="tool-card-description">${escapeHtml(desc)}</p>
</li>`;
    })
    .join('');
  resultsEl.innerHTML = `<ul class="tools-grid" role="list">${items}</ul>`;
};

const runSearch = (query) => {
  const q = (query ?? '').trim();
  if (!q) {
    resultsEl.innerHTML = '';
    return;
  }
  if (!fuse) {
    resultsEl.innerHTML = '';
    return;
  }
  const results = fuse.search(q, { limit: 50 });
  renderResults(results);
};

const onInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => runSearch(input.value), DEBOUNCE_MS);
};

const initFuse = (data) => {
  fuse = new window.Fuse(data, {
    keys: [
      { name: 'searchableText', weight: 0.7 },
      { name: 'name', weight: 0.2 },
      { name: 'description', weight: 0.1 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
  });
  input.addEventListener('input', onInput);
  input.addEventListener('search', onInput);
  const form = input.closest('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      runSearch(input.value);
    });
  }
};

function showLoadError() {
  resultsEl.innerHTML = `<p class="search-no-js">${escapeHtml(i18n.loadError)}</p>`;
}

(async () => {
  if (typeof window.Fuse === 'undefined') {
    showLoadError();
    return;
  }
  try {
    const res = await fetch(indexUrl);
    if (!res.ok) {
      showLoadError();
      return;
    }
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data?.tools ?? []);
    initFuse(list);
  } catch {
    showLoadError();
  }
})();
})();

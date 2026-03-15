'use strict';

(function () {
  var filtersEl = document.getElementById('tool-filters');
  var gridEl = document.getElementById('tools-grid');
  var clearEl = document.getElementById('filter-clear');
  var announceEl = document.getElementById('filter-announce');
  var noResultsEl = document.getElementById('filter-no-results');
  if (!filtersEl || !gridEl) return;

  var i18n = window.FILTER_I18N || { noResults: '', showing: '' };

  // Single-select filters (only one value at a time)
  var SINGLE_SELECT = { category: true };
  // Toggle filters (on/off)
  var TOGGLES = { 'open-source': true, 'self-hostable': true, 'eu-company': true };

  // State: { category: '', 'open-source': false, ... 'data-residency': Set, 'data-portability': Set }
  var state = {
    category: '',
    'open-source': false,
    'self-hostable': false,
    'eu-company': false,
    'data-residency': new Set(),
    'data-portability': new Set()
  };

  var cards = gridEl.querySelectorAll('.card[data-category]');
  var totalCount = cards.length;

  function isAnyFilterActive() {
    if (state.category) return true;
    if (state['open-source'] || state['self-hostable'] || state['eu-company']) return true;
    if (state['data-residency'].size > 0 || state['data-portability'].size > 0) return true;
    return false;
  }

  function applyFilters() {
    var visibleCount = 0;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var visible = true;

      // Category (single-select)
      if (state.category && card.getAttribute('data-category') !== state.category) {
        visible = false;
      }

      // Boolean toggles
      if (visible && state['open-source'] && card.getAttribute('data-open-source') !== 'true') {
        visible = false;
      }
      if (visible && state['self-hostable'] && card.getAttribute('data-self-hostable') !== 'true') {
        visible = false;
      }
      if (visible && state['eu-company'] && card.getAttribute('data-eu-company') !== 'true') {
        visible = false;
      }

      // Multi-select: data residency
      if (visible && state['data-residency'].size > 0) {
        if (!state['data-residency'].has(card.getAttribute('data-data-residency'))) {
          visible = false;
        }
      }

      // Multi-select: data portability
      if (visible && state['data-portability'].size > 0) {
        if (!state['data-portability'].has(card.getAttribute('data-data-portability'))) {
          visible = false;
        }
      }

      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    }

    // Show/hide no-results message
    if (noResultsEl) {
      noResultsEl.hidden = visibleCount > 0;
    }
    gridEl.style.display = visibleCount > 0 ? '' : 'none';

    // Clear button visibility
    if (clearEl) {
      clearEl.hidden = !isAnyFilterActive();
    }

    // Screen reader announcement
    if (announceEl && isAnyFilterActive()) {
      announceEl.textContent = i18n.showing
        .replace('%d', visibleCount)
        .replace('%d', totalCount);
    } else if (announceEl) {
      announceEl.textContent = '';
    }
  }

  function syncURL() {
    var params = new URLSearchParams();

    if (state.category) params.set('category', state.category);
    if (state['open-source']) params.set('open_source', 'true');
    if (state['self-hostable']) params.set('self_hostable', 'true');
    if (state['eu-company']) params.set('eu_company', 'true');
    if (state['data-residency'].size > 0) {
      params.set('data_residency', Array.from(state['data-residency']).join(','));
    }
    if (state['data-portability'].size > 0) {
      params.set('data_portability', Array.from(state['data-portability']).join(','));
    }

    var search = params.toString();
    var url = window.location.pathname + (search ? '?' + search : '');
    history.replaceState(null, '', url);
  }

  function readURL() {
    var params = new URLSearchParams(window.location.search);

    state.category = params.get('category') || '';
    state['open-source'] = params.get('open_source') === 'true';
    state['self-hostable'] = params.get('self_hostable') === 'true';
    state['eu-company'] = params.get('eu_company') === 'true';

    state['data-residency'] = new Set();
    var dr = params.get('data_residency');
    if (dr) {
      dr.split(',').forEach(function (v) { state['data-residency'].add(v); });
    }

    state['data-portability'] = new Set();
    var dp = params.get('data_portability');
    if (dp) {
      dp.split(',').forEach(function (v) { state['data-portability'].add(v); });
    }

    // Sync button states from state
    var buttons = filtersEl.querySelectorAll('.filter-chip');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var filter = btn.getAttribute('data-filter');
      var value = btn.getAttribute('data-value');

      if (SINGLE_SELECT[filter]) {
        btn.setAttribute('aria-pressed', value === state[filter] ? 'true' : 'false');
      } else if (TOGGLES[filter]) {
        btn.setAttribute('aria-pressed', state[filter] ? 'true' : 'false');
      } else {
        // Multi-select
        btn.setAttribute('aria-pressed', state[filter].has(value) ? 'true' : 'false');
      }
    }
  }

  function clearAll() {
    state.category = '';
    state['open-source'] = false;
    state['self-hostable'] = false;
    state['eu-company'] = false;
    state['data-residency'] = new Set();
    state['data-portability'] = new Set();

    var buttons = filtersEl.querySelectorAll('.filter-chip');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var filter = btn.getAttribute('data-filter');
      var value = btn.getAttribute('data-value');
      // Only the "All" category button (value="") should be pressed
      if (SINGLE_SELECT[filter]) {
        btn.setAttribute('aria-pressed', value === '' ? 'true' : 'false');
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }
    }

    applyFilters();
    syncURL();
  }

  // Event delegation for filter chips
  filtersEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-chip');
    if (!btn) return;

    var filter = btn.getAttribute('data-filter');
    var value = btn.getAttribute('data-value');

    if (SINGLE_SELECT[filter]) {
      // Single-select: deselect siblings, select this one
      state[filter] = value;
      var siblings = filtersEl.querySelectorAll('.filter-chip[data-filter="' + filter + '"]');
      for (var i = 0; i < siblings.length; i++) {
        siblings[i].setAttribute('aria-pressed', siblings[i] === btn ? 'true' : 'false');
      }
    } else if (TOGGLES[filter]) {
      // Toggle on/off
      state[filter] = !state[filter];
      btn.setAttribute('aria-pressed', state[filter] ? 'true' : 'false');
    } else {
      // Multi-select: toggle value in set
      if (state[filter].has(value)) {
        state[filter].delete(value);
        btn.setAttribute('aria-pressed', 'false');
      } else {
        state[filter].add(value);
        btn.setAttribute('aria-pressed', 'true');
      }
    }

    applyFilters();
    syncURL();
  });

  // Clear button
  if (clearEl) {
    clearEl.addEventListener('click', function (e) {
      e.preventDefault();
      clearAll();
    });
  }

  // Initialize from URL
  readURL();
  if (isAnyFilterActive()) {
    applyFilters();
  }
})();

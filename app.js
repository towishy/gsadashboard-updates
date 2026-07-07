/**
 * GSA Dashboard – app.js
 * Client-side data, chart rendering, and interactivity.
 */

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const FISCAL_YEARS = ['FY2021', 'FY2022', 'FY2023', 'FY2024', 'FY2025'];

const SPENDING_DATA = {
  FY2025: [11.2, 13.5, 10.8, 14.1, 12.7, 15.3, 13.9, 16.2, 14.8, 17.1, 15.6, 18.4],
  FY2024: [9.8, 11.2, 10.1, 12.4, 11.0, 13.2, 12.1, 14.0, 12.8, 14.9, 13.5, 16.1],
  FY2023: [8.5, 9.6, 8.9, 10.8, 9.4, 11.3, 10.5, 12.1, 10.9, 13.0, 11.7, 14.2],
};

const CATEGORY_DATA = {
  FY2025: [28.4, 19.7, 16.2, 14.3, 11.8, 9.6],
  FY2024: [25.1, 17.3, 14.8, 12.9, 10.5, 8.4],
};

const CATEGORY_LABELS = [
  'IT & Technology',
  'Professional Services',
  'Facilities & Construction',
  'Transportation & Logistics',
  'Scientific & Research',
  'Other',
];

const AGENCIES = [
  {
    name: 'Department of Defense',
    abbr: 'DoD',
    budget: '$182.4B',
    spent: 94,
    status: 'on-track',
    contracts: 4812,
    savings: '$2.1B',
  },
  {
    name: 'Dept. of Health & Human Services',
    abbr: 'HHS',
    budget: '$98.7B',
    spent: 88,
    status: 'on-track',
    contracts: 2341,
    savings: '$870M',
  },
  {
    name: 'Dept. of Homeland Security',
    abbr: 'DHS',
    budget: '$64.2B',
    spent: 71,
    status: 'at-risk',
    contracts: 1876,
    savings: '$340M',
  },
  {
    name: 'Dept. of Veterans Affairs',
    abbr: 'VA',
    budget: '$51.6B',
    spent: 82,
    status: 'on-track',
    contracts: 1542,
    savings: '$560M',
  },
  {
    name: 'Dept. of Energy',
    abbr: 'DoE',
    budget: '$43.1B',
    spent: 63,
    status: 'at-risk',
    contracts: 987,
    savings: '$210M',
  },
  {
    name: 'Dept. of Transportation',
    abbr: 'DoT',
    budget: '$38.4B',
    spent: 55,
    status: 'delayed',
    contracts: 1124,
    savings: '$140M',
  },
  {
    name: 'NASA',
    abbr: 'NASA',
    budget: '$25.2B',
    spent: 78,
    status: 'on-track',
    contracts: 763,
    savings: '$320M',
  },
  {
    name: 'Dept. of Education',
    abbr: 'ED',
    budget: '$19.8B',
    spent: 90,
    status: 'on-track',
    contracts: 428,
    savings: '$95M',
  },
  {
    name: 'Dept. of Agriculture',
    abbr: 'USDA',
    budget: '$17.3B',
    spent: 44,
    status: 'delayed',
    contracts: 612,
    savings: '$78M',
  },
  {
    name: 'Dept. of Commerce',
    abbr: 'DoC',
    budget: '$11.6B',
    spent: 68,
    status: 'on-track',
    contracts: 389,
    savings: '$52M',
  },
];

const ACTIVITIES = [
  {
    text: 'DoD awarded a $4.2B IT modernization contract to Leidos',
    time: '2 hours ago',
    color: 'blue',
  },
  {
    text: 'HHS FY2025 SmartPay spending report published',
    time: '4 hours ago',
    color: 'green',
  },
  {
    text: 'DHS flagged 3 contracts for acquisition review – risk level elevated',
    time: '6 hours ago',
    color: 'red',
  },
  {
    text: 'VA completed $560M in cumulative savings this quarter',
    time: '8 hours ago',
    color: 'green',
  },
  {
    text: 'DoT acquisition delay notice issued for infrastructure contracts',
    time: '12 hours ago',
    color: 'gold',
  },
  {
    text: 'GSA Fleet updated vehicle acquisition guidelines for FY2026',
    time: '1 day ago',
    color: 'blue',
  },
  {
    text: 'DoE contract modification submitted for nuclear facilities',
    time: '1 day ago',
    color: 'gold',
  },
  {
    text: 'NASA awarded $1.1B Artemis logistics support contract',
    time: '2 days ago',
    color: 'blue',
  },
];

const PERFORMANCE_CATEGORIES = [
  { label: 'On-Track Agencies', value: 60, color: '#00a91c' },
  { label: 'At-Risk Agencies', value: 20, color: '#e5a000' },
  { label: 'Delayed Agencies', value: 20, color: '#d54309' },
];

/* ─────────────────────────────────────────────
   State
───────────────────────────────────────────── */
let currentFY = 'FY2025';
let sortCol = null;
let sortDir = 'asc';
let searchQuery = '';
let currentPage = 1;
const ROWS_PER_PAGE = 5;

let spendingChart = null;
let categoryChart = null;
let performanceChart = null;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

function formatNumber(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  return '$' + n.toLocaleString();
}

function statusClass(s) {
  if (s === 'on-track') return 'on-track';
  if (s === 'at-risk') return 'at-risk';
  return 'delayed';
}

function statusLabel(s) {
  if (s === 'on-track') return 'On Track';
  if (s === 'at-risk') return 'At Risk';
  return 'Delayed';
}

function progressClass(pct) {
  if (pct >= 85) return 'green';
  if (pct >= 60) return '';
  if (pct >= 45) return 'gold';
  return 'red';
}

/* ─────────────────────────────────────────────
   Spending Line Chart
───────────────────────────────────────────── */
function initSpendingChart() {
  const ctx = document.getElementById('spendingChart').getContext('2d');
  const d25 = SPENDING_DATA['FY2025'];
  const d24 = SPENDING_DATA['FY2024'];
  const d23 = SPENDING_DATA['FY2023'];

  spendingChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: 'FY2025',
          data: d25,
          borderColor: '#005ea2',
          backgroundColor: 'rgba(0, 94, 162, 0.08)',
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: 'FY2024',
          data: d24,
          borderColor: '#00a91c',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.35,
          borderDash: [5, 3],
          pointRadius: 2,
          pointHoverRadius: 5,
        },
        {
          label: 'FY2023',
          data: d23,
          borderColor: '#71767a',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          tension: 0.35,
          borderDash: [3, 4],
          pointRadius: 2,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 16, font: { size: 12 }, usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ` ${ctx.dataset.label}: $${ctx.parsed.y.toFixed(1)}B`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.06)' },
          ticks: {
            font: { size: 11 },
            callback(v) {
              return '$' + v + 'B';
            },
          },
        },
      },
    },
  });
}

/* ─────────────────────────────────────────────
   Category Donut Chart
───────────────────────────────────────────── */
function initCategoryChart() {
  const ctx = document.getElementById('categoryChart').getContext('2d');

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: CATEGORY_LABELS,
      datasets: [
        {
          data: CATEGORY_DATA['FY2025'],
          backgroundColor: [
            '#005ea2',
            '#00a91c',
            '#e5a000',
            '#7b2d8b',
            '#d54309',
            '#71767a',
          ],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 12 }, padding: 14, usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ` ${ctx.label}: $${ctx.parsed.toFixed(1)}B`;
            },
          },
        },
      },
    },
  });
}

/* ─────────────────────────────────────────────
   Performance Doughnut Chart
───────────────────────────────────────────── */
function initPerformanceChart() {
  const ctx = document.getElementById('performanceChart').getContext('2d');

  performanceChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: PERFORMANCE_CATEGORIES.map((c) => c.label),
      datasets: [
        {
          data: PERFORMANCE_CATEGORIES.map((c) => c.value),
          backgroundColor: PERFORMANCE_CATEGORIES.map((c) => c.color),
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 12 }, padding: 12, usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ` ${ctx.label}: ${ctx.parsed}%`;
            },
          },
        },
      },
    },
  });
}

/* ─────────────────────────────────────────────
   Agency Table
───────────────────────────────────────────── */
function getFilteredAgencies() {
  let data = [...AGENCIES];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    data = data.filter(
      (a) => a.name.toLowerCase().includes(q) || a.abbr.toLowerCase().includes(q)
    );
  }
  if (sortCol !== null) {
    data.sort((a, b) => {
      let va = a[sortCol];
      let vb = b[sortCol];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return data;
}

function renderTable() {
  const filtered = getFilteredAgencies();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const slice = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const tbody = document.getElementById('agencyTableBody');
  tbody.innerHTML = slice
    .map(
      (a) => `
    <tr>
      <td>
        <div class="agency-name">${a.name}</div>
        <div class="agency-abbr">${a.abbr}</div>
      </td>
      <td class="text-right font-mono fw-bold">${a.budget}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="progress-bar-wrap" style="flex:1">
            <div class="progress-bar-fill ${progressClass(a.spent)}" style="width:${a.spent}%"></div>
          </div>
          <span style="font-size:13px;font-weight:700;min-width:36px;color:#1b2a4a">${a.spent}%</span>
        </div>
      </td>
      <td><span class="status-badge ${statusClass(a.status)}">${statusLabel(a.status)}</span></td>
      <td class="text-right">${a.contracts.toLocaleString()}</td>
      <td class="text-right text-green fw-bold">${a.savings}</td>
    </tr>
  `
    )
    .join('');

  // Pagination info
  document.getElementById('pageInfo').textContent =
    `Showing ${Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filtered.length)}–${Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of ${filtered.length} agencies`;

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const wrap = document.getElementById('paginationControls');
  let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹ Prev</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next ›</button>`;
  wrap.innerHTML = html;
}

function goPage(p) {
  const filtered = getFilteredAgencies();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTable();
}

function handleSearch(e) {
  searchQuery = e.target.value.trim();
  currentPage = 1;
  renderTable();
}

function handleSort(col) {
  if (sortCol === col) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortCol = col;
    sortDir = 'asc';
  }
  // Update sort icons
  document.querySelectorAll('thead th.sortable').forEach((th) => {
    const icon = th.querySelector('.sort-icon');
    if (th.dataset.col === col) {
      icon.textContent = sortDir === 'asc' ? '▲' : '▼';
    } else {
      icon.textContent = '⇅';
    }
  });
  renderTable();
}

/* ─────────────────────────────────────────────
   Activity Feed
───────────────────────────────────────────── */
function renderActivity() {
  const list = document.getElementById('activityList');
  list.innerHTML = ACTIVITIES.map(
    (a) => `
    <li class="activity-item">
      <div class="activity-dot ${a.color}"></div>
      <div style="flex:1">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </li>
  `
  ).join('');
}

/* ─────────────────────────────────────────────
   Category Breakdown (mini stats)
───────────────────────────────────────────── */
function renderCategoryBreakdown() {
  const wrap = document.getElementById('categoryBreakdown');
  const data = CATEGORY_DATA['FY2025'];
  const total = data.reduce((a, b) => a + b, 0);
  wrap.innerHTML = CATEGORY_LABELS.map(
    (label, i) => `
    <div class="mini-stat-row">
      <div class="mini-stat-label">${label}</div>
      <div class="mini-stat-bar-wrap">
        <div class="mini-stat-bar" style="width:${(data[i] / total) * 100}%;background:${['#005ea2','#00a91c','#e5a000','#7b2d8b','#d54309','#71767a'][i]}"></div>
      </div>
      <div class="mini-stat-value">$${data[i].toFixed(1)}B</div>
    </div>
  `
  ).join('');
}

/* ─────────────────────────────────────────────
   Tabs
───────────────────────────────────────────── */
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === tabId);
  });
}

/* ─────────────────────────────────────────────
   Alert Dismiss
───────────────────────────────────────────── */
function dismissAlert(btn) {
  btn.closest('.alert-banner').remove();
}

/* ─────────────────────────────────────────────
   Refresh
───────────────────────────────────────────── */
function refreshDashboard() {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.textContent = '⟳ Refreshing…';

  // Simulate async fetch with a small jitter
  setTimeout(() => {
    // Update last-updated timestamp
    const now = new Date();
    document.getElementById('lastUpdated').textContent =
      'Last updated: ' +
      now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });

    btn.disabled = false;
    btn.innerHTML = '↻ Refresh';
  }, 1200);
}

/* ─────────────────────────────────────────────
   Init
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSpendingChart();
  initCategoryChart();
  initPerformanceChart();
  renderTable();
  renderActivity();
  renderCategoryBreakdown();

  // Set initial last-updated time
  const now = new Date();
  document.getElementById('lastUpdated').textContent =
    'Last updated: ' +
    now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
});

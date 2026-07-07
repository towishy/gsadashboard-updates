# GSA Acquisition & Spending Dashboard

A responsive, browser-based dashboard for tracking U.S. General Services Administration (GSA) federal acquisition metrics, agency budget execution, and contract performance.

## Features

- **Key Metrics Cards** – Total YTD spending, active contracts, participating agencies, cumulative savings, and at-risk count
- **Monthly Spending Trend** – Line chart comparing FY2023, FY2024, and FY2025 obligations by fiscal month
- **Spending by Category** – Donut chart and bar breakdown for IT, Professional Services, Facilities, Transportation, and more
- **Agency Performance** – Status distribution donut (on-track / at-risk / delayed)
- **Agency Table** – Searchable, sortable, paginated table of agency budget utilization, contract counts, and savings
- **Recent Activity Feed** – Latest acquisition events and updates
- **Refresh** – Simulated data refresh with updated timestamp
- **Responsive design** – Works on desktop, tablet, and mobile

## Getting Started

No build step required. Open `index.html` directly in any modern browser, or serve the directory with any static file server:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080` in your browser.

## Project Structure

```
gsadashboard-updates/
├── index.html   # Main dashboard page
├── styles.css   # Responsive styles (USWDS-inspired color tokens)
├── app.js       # Data, chart rendering (Chart.js), and interactivity
└── README.md
```

## Dependencies

- [Chart.js 4.4](https://www.chartjs.org/) – loaded via CDN in `index.html` (no installation needed)

## Data

All data in this dashboard is illustrative sample data modelled on publicly available USASpending.gov figures. Replace the data constants at the top of `app.js` with live API calls to integrate real federal spending data.

## Accessibility

- Semantic HTML landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`)
- ARIA labels on interactive elements and charts
- Keyboard-navigable controls
- `aria-live` regions for dynamic content updates

# Fermer-to-Customer--kishibazar
# KrishiBazar — Farmer-to-Consumer Marketplace

KrishiBazar (কৃষিবাজার) is a complete farmer-to-consumer direct marketplace platform built for Bangladesh, designed as a university web development course project. It connects farmers directly with customers — cutting out middlemen — while including a full delivery/courier system and an admin control panel.

> Inspired by platforms like FarmDrop (UK) and Farmigo (USA), adapted for the Bangladeshi market where farmer-to-consumer e-commerce is still an open opportunity.

##  Live Demo Credentials

The app ships with realistic seed data and five demo accounts so every portal can be explored immediately — no signup required.

| Role | Phone | Password |
|---|---|---|
|  Admin | `01700000000` | `admin123` |
|  Farmer (Rahim) | `01811111111` | `farmer123` |
|  Farmer (Sumaiya) | `01822222222` | `farmer456` |
|  Customer | `01900000000` | `user123` |
|  Courier (Raju) | `01912345678` | `courier123` |
|  Courier (Salma) | `01823456789` | `courier456` |

The login screen has one-click buttons that auto-fill these for you.

## Portals

**Customer Portal** — browse products with search/filter/sort, organic-only toggle, price range filter, product detail modal with reviews, shopping cart, checkout (cash/bKash/Nagad), order history, live order tracking, in-app chat with farmers, and weekly subscription boxes.

**Farmer Portal** — dashboard with sales chart, full product CRUD (add/edit/deactivate/delete), order management filtered to the farmer's own items, per-farmer analytics, and profile page.

**Admin Portal** — platform-wide dashboard with revenue/commission breakdown, farmer verification queue, product moderation (feature/delete), order status + courier assignment, courier fleet management, and analytics across the whole marketplace.

**Courier Portal** — online/offline toggle, accept unassigned orders, advance deliveries through pipeline stages (placed → assigned → picked → transit → nearby → delivered), delivery history with per-order earnings, and profile.

All four portals **share the same in-memory state** — placing an order as a customer is immediately visible to the relevant farmer, to the admin, and to whichever courier accepts it.

## Delivery Pipeline

```
Placed → Courier Assigned → Picked Up → In Transit → Nearby → Delivered
```

Tracking is visualized with an animated progress bar and stage timeline, available from the Customer, Admin, and Courier portals via a shared `TrackModal` component.

## Tech Stack

- **React 18** (functional components + hooks — `useState`, `useEffect`, `useRef`)
- **Vite** for dev server and build tooling
- Plain inline styles (no CSS framework) — see [`src/styles`](./src/styles) for the design token system
- No backend required to run the demo — all data is seeded in [`src/data`](./src/data) and held in component state

## Project Structure

```
krishibazar/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # Shared, reusable UI pieces
│   │   ├── MiniChart.jsx
│   │   ├── Stars.jsx
│   │   └── TrackModal.jsx
│   ├── data/               # Seed/demo data + constant lookups
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── couriers.js
│   │   └── constants.js
│   ├── pages/               # One file per portal
│   │   ├── LoginPage.jsx
│   │   ├── CustomerPortal.jsx
│   │   ├── FarmerPortal.jsx
│   │   ├── AdminPortal.jsx
│   │   └── CourierPortal.jsx
│   ├── styles/
│   │   ├── theme.js          # Color tokens
│   │   └── sharedStyles.js   # Shared style-object generator
│   ├── App.jsx               # Routes logged-in user to the right portal
│   ├── main.jsx               # React entry point
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/<your-username>/krishibazar.git
cd krishibazar
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Design System

The UI uses a purple/indigo "modern tech" palette defined centrally in [`src/styles/theme.js`](./src/styles/theme.js). To change the whole app's color scheme, edit the values in that one file — every component pulls colors from there rather than hardcoding hex values.

| Token | Color | Used for |
|---|---|---|
| `leaf` | `#4F39F6` | Primary brand / buttons |
| `harvest` | `#A855F7` | Secondary accent |
| `soil` | `#1E1B3A` | Nav bars, dark text |
| `cream` | `#F5F4FB` | Light-mode background |
| `dark` | `#0E0B1F` | Dark-mode background |

Dark mode is built in — every portal has a 🌙/☀️ toggle in its nav bar.

## Data Model Notes

This is a **front-end demo with realistic seed data**, not a production backend. To turn this into a real product you would need to:

1. Replace `src/data/*.js` seed arrays with API calls to a real backend (Node/Express + PostgreSQL or MongoDB are natural choices).
2. Add real authentication (the current login is a plaintext password match against the seed array — fine for a course demo, **not** fine for production).
3. Persist orders/products/users server-side instead of in React state (currently everything resets on page refresh).
4. Add payment gateway integration for bKash/Nagad instead of the current "select payment method" simulation.

## Course Context

This project was built as a complete answer to: *"build a farmer-to-consumer marketplace, similar to platforms that have succeeded abroad but are still an open opportunity in Bangladesh."* It demonstrates multi-role authentication, CRUD operations, state synchronization across user roles, and a realistic e-commerce + logistics flow — appropriate scope for a university web development course capstone.

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

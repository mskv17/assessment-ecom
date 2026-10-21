# Harvest & Hearth — Artisanal Food Storefront

> Production-ready, accessible, high-converting React + TypeScript e-commerce storefront for pure artisanal and organic foods. Built following the complete **E-Commerce Frontend Product Catalogue Specification**.

---

## 🌾 Project Overview

**Harvest & Hearth** is a responsive e-commerce web application designed for a curated organic food brand offering wood-pressed oils, high-altitude raw honeys, heritage grains, single-origin spices, superfood seeds, and artisanal teas.

This phase is strictly **frontend-only**. It features a decoupled repository/service architecture running by default on a rich, realistic in-memory mock dataset with Indian Rupee (`₹`) pricing, simulated network latency, and AbortController request cancellation. When a real REST or GraphQL backend is ready, switching to live HTTP calls requires modifying a single environment variable—with **zero changes** to UI components or page layouts.

---

## ✨ Key Features & Conversion Highlights (CRO)

- **Landing & Discovery Above the Fold**: Clear value proposition with immediate 1-click CTA leading into the catalogue.
- **Low-Friction Live Search & Filters**:
  - 300ms debounced search over names, descriptions, and regional origins.
  - Category selector, price sort, in-stock toggle, and specialty dietary chips (`Certified Organic`, `A2 Certified`, `Raw Vegan`, `Gluten-Free`).
  - URL synchronization for bookmarkable, shareable filter states (`/shop?category=cat_oils&sort=price-asc`).
  - Active filter chips with 1-click removal and "Clear All" state ensuring no user ever reaches a dead end.
- **Persuasive Product Details (PDP)**:
  - High-resolution photography with aspect ratio reservation to prevent Cumulative Layout Shift (CLS).
  - Indian Rupee (`₹`) formatting with strikethrough compare-at pricing and percentage savings badges.
  - Live stock indicators (`In Stock`, `Limited Harvest: Only X left`, `Sold Out`).
  - Pack and unit sizes clearly declared (`500 ml Glass Jar`, `1 kg Kraft Pouch`).
  - Pure ingredients declaration and geographic harvest origin.
  - Related complementary products recommendations.
- **Mobile-First Conversion**:
  - All interactive buttons meet the $\ge 44\text{px}$ minimum touch target standard.
  - **Sticky Mobile Add-to-Cart Bar**: Appears dynamically on mobile viewports when scrolling past the main buy box, keeping price and conversion 1 tap away.
- **Zero Dark Patterns & Honest Demo Notice**:
  - No fake countdown timers, artificial viewer counts, or forced pre-checked add-ons.
  - Persistent shopping basket drawer with dynamic free-shipping progress meter (Free shipping over ₹999).
  - Frictionless **Demo Checkout Modal** validating customer details with Zod and explicitly confirming its prototype status without charging fees.
- **Resilience & Accessibility**:
  - Top-level and component-level React `ErrorBoundary` fallback.
  - User-friendly error states with actionable `Try Again` retry handlers.
  - Full keyboard navigation and ARIA landmarks.
  - Custom 404 page with direct recovery links.
- **CRO Analytics Tracking Abstraction**:
  - Centralized `analyticsService.ts` dispatching standard e-commerce events (`view_item`, `search`, `filter_applied`, `add_to_cart`, `remove_from_cart`, `begin_checkout`) without recording personal data.

---

## 🛠 Tech Stack & Architectural Decisions

| Layer | Technology | Decision Rationale |
|---|---|---|
| **UI Framework** | React 19 + Vite 8 | Instant hot module replacement (HMR), tree-shaking, and lightweight build output. |
| **Language** | TypeScript 5 | Strict compile-time contracts matching future backend DTO schemas. |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design, custom organic design tokens, zero runtime CSS overhead. |
| **Routing** | React Router DOM v7 | Client-side routing with code-splitting via `React.lazy` and `Suspense`. |
| **State Management** | Context API + LocalStorage | Lightweight cart persistence without heavyweight third-party state managers. |
| **Validation** | Zod | Runtime schema validation for query parameters, integer quantity bounds, and checkout inputs. |
| **Testing** | Vitest + React Testing Library | Blazing-fast unit and component behavior tests with DOM cleanup. |
| **Browser E2E** | Playwright | Full cross-browser end-to-end shopping journey test suites. |
| **Icons** | Lucide React | Modern, tree-shakeable accessible SVG icons. |

---

## 🚀 Quickstart & Prerequisites

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on Node `v24.4.1`)
- **NPM**: `v9.0.0` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/harvest-and-hearth.git
cd harvest-and-hearth

# Install dependencies
npm install

# Setup environment configuration
cp .env.example .env
```

---

## 📜 Developer Commands

As mandated by Section 15 of the specification:

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local development server at `http://localhost:5173` |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `dist/` |
| `npm run preview` | Locally serves the production build for testing |
| `npm run typecheck` | Runs `tsc --noEmit` to verify type safety across all files |
| `npm run lint` | Runs oxlint/linter checks on source files |
| `npm run test` | Executes unit, component, and service tests using Vitest |
| `npm run test:watch` | Starts Vitest in interactive watch mode |
| `npm run test:e2e` | Runs Playwright end-to-end user journey tests |

---

## 📁 Repository Structure Overview

```
harvest-and-hearth/
├── src/
│   ├── assets/              # Static branding and icons
│   ├── components/
│   │   ├── common/          # Reusable primitives (Button, Badge, Input, Modal, Skeleton, EmptyState)
│   │   ├── layout/          # Header, Footer, navigation drawers
│   │   ├── cart/            # CartDrawer, DemoCheckoutModal
│   │   ├── shop/            # ProductCard, ProductGrid, ProductFilters, ActiveFilters, CategoryCard
│   │   └── pdp/             # Product details components and StickyMobileAddToCart
│   ├── context/             # CartContext and ToastContext
│   ├── data/                # Realistic mock categories and products
│   ├── hooks/               # useProducts, useProduct, useCategories, useDebounce
│   ├── pages/               # HomePage, ShopPage, ProductDetailsPage, NotFoundPage
│   ├── routes/              # AppRoutes with React.lazy code splitting
│   ├── services/            # Service abstraction layer (contracts, mock, http, analytics)
│   ├── types/               # TypeScript interfaces (Product, Category, Cart, Analytics)
│   └── utils/               # Currency formatter (INR), error normalizers, Zod validators
├── tests/
│   ├── unit/                # Unit tests for currency, validators, mock service
│   ├── component/           # RTL tests for ProductCard, QuantitySelector, EmptyState
│   └── e2e/                 # Playwright storefront shopping flow tests
├── .env.example             # Documented environment variables template
├── ARCHITECTURE.md          # Architectural decisions & system design
├── API_INTEGRATION.md       # API contract, schemas, and backend migration guide
├── TESTING_AND_DEBUGGING.md # Testing guides, manual QA checklist & common issues
├── PERFORMANCE.md           # Core Web Vitals targets, Lighthouse audit, bundle breakdown
├── vercel.json              # SPA rewrite rules for production deployment
└── vite.config.ts           # Vite + Tailwind + Vitest configuration
```

---

## 🔌 Switching from Mock Data to Real API

The application adheres strictly to the **Repository / Service Pattern**:
1. Open your `.env` file (or set Vercel production environment variables):
   ```bash
   VITE_USE_MOCK_DATA=false
   VITE_API_BASE_URL=https://api.yourbackend.com/v1
   ```
2. The service factory in `src/services/index.ts` will instantly route all queries through `HttpProductService` and `HttpCategoryService`.
3. Consult [API_INTEGRATION.md](file:///d:/internship%20projucts/ecom/API_INTEGRATION.md) for expected endpoint specifications and payload schemas.

---

## 🚢 Deployment to Vercel

The repository includes a ready `vercel.json` configured with single-page application (SPA) rewrites to ensure direct route refreshes (e.g. `/shop`, `/product/a2-vedic-bilona-cow-ghee`, or unknown 404 paths) serve `index.html` without routing errors:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📄 License & Attribution
Crafted with pride for the Frontend Assessment Specification. All food photography assets are licensed via Unsplash.

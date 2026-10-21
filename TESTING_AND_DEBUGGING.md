# Testing, Quality Assurance & Debugging Guide

> Complete test instructions, browser debugging workflows, common troubleshooting scenarios, and a manual QA checklist for **Harvest & Hearth**.

---

## 1. Automated Test Suites & Commands

The project employs a multi-tiered automated testing pyramid:

| Level | Framework | Command | What It Verifies |
|---|---|---|---|
| **Static Typing** | TypeScript | `npm run typecheck` | Strict compilation, interface conformance, no missing properties |
| **Linting** | oxlint | `npm run lint` | Code quality, dead code detection, syntax checks |
| **Unit Tests** | Vitest | `npm run test` | INR currency formatting, discount calculations, Zod validation schemas |
| **Service Tests** | Vitest | `npm run test` | Mock service latency, filtering predicates, slug resolution, error handling |
| **Component Tests** | React Testing Library | `npm run test` | ProductCard rendering, QuantitySelector buttons, EmptyState callbacks |
| **End-to-End Tests** | Playwright | `npm run test:e2e` | Full multi-page user journeys (Home $\to$ Shop $\to$ PDP $\to$ Cart $\to$ Demo Checkout) |

---

## 2. Test Execution Details

### 2.1 Running Unit & Component Tests
```bash
# Run all tests once
npm run test

# Run tests in interactive watch mode during development
npm run test:watch
```

### 2.2 Running End-to-End Tests
```bash
# Run Playwright tests headlessly
npm run test:e2e

# Run Playwright tests with UI debugger mode
npx playwright test --ui
```

---

## 3. Browser Debugging & Diagnostics

### 3.1 Analytics Event Verification
All CRO conversion events (`view_item`, `search`, `filter_applied`, `add_to_cart`, `remove_from_cart`, `begin_checkout`) log structured telemetry to the browser console when running in development mode (`VITE_ENABLE_ANALYTICS_LOGS=true`).
- Open **Chrome DevTools $\to$ Console**.
- Filter by `[Analytics Track]` to view real-time dispatched event payloads.

### 3.2 Network Latency & Throttling
To simulate real-world mobile 4G or offline network conditions:
1. Open **Chrome DevTools $\to$ Network tab**.
2. Select **Fast 3G** or **Slow 3G** in the throttling dropdown.
3. Observe how the shimmering skeleton states (`ProductCardSkeleton`, `Skeleton`) maintain layout stability and prevent Cumulative Layout Shift (CLS).
4. Select **Offline** to test the `ErrorState` retry action.

### 3.3 Inspecting LocalStorage Cart State
Basket items persist locally under the key `harvest_hearth_cart_v1`:
- Open **DevTools $\to$ Application $\to$ Local Storage $\to$ http://localhost:5173**.
- Inspect or clear the `harvest_hearth_cart_v1` array to verify initial empty states.

---

## 4. Manual QA Verification Checklist

Before submitting or deploying to production, execute this manual quality gate checklist:

### 🛍 1. Home & Navigation
- [x] Brand logo in header redirects to `/`.
- [x] "Explore Fresh Pantry" CTA links to `/shop`.
- [x] Category cards in the showcase carousel link to the respective category filter in `/shop`.
- [x] Header search input submits and navigates to `/shop?q=...`.
- [x] Header cart button shows live item count badge and updates with subtotal.

### 🔍 2. Shop & Catalog Filtering
- [x] Typing into the search bar debounces for 300ms before executing query.
- [x] Clicking a category filter highlights the active button and updates the product grid.
- [x] Filtering by in-stock only hides sold-out products.
- [x] Sorting by "Price: Low to High" and "Price: High to Low" properly orders items.
- [x] Active filters pill bar displays currently applied filters with "x" removal buttons and a "Clear All" link.
- [x] Zero search results displays `EmptyState` with a working "Reset All Filters" CTA.

### 🍯 3. Product Details Page (PDP)
- [x] Product image displays with proper aspect ratio and crisp fidelity.
- [x] Compare-at price renders with strike-through and percentage-off savings badge.
- [x] Unit label (e.g. `500 ml Glass Jar`) is prominently shown.
- [x] Quantity selector increments and decrements between 1 and available stock (capped at 99).
- [x] "Add to Basket" updates cart count and triggers a toast notification.
- [x] Mobile viewport shows sticky bottom Add to Basket bar when scrolling past the main buy box.
- [x] Related products render at the bottom of the page and link to their respective PDPs.
- [x] Visiting a nonexistent product URL (`/product/does-not-exist`) displays the friendly 404 error state.

### 🛒 4. Cart Drawer & Demo Checkout
- [x] Cart drawer slides open smoothly from the right without page jump.
- [x] Quantity adjusters in cart recalculate line item total and subtotal instantly.
- [x] Free shipping progress meter calculates exact amount remaining for free shipping (₹999 threshold).
- [x] Removing an item smoothly updates item counts and subtotal.
- [x] Emptying cart displays empty state with a "Start Exploring" button.
- [x] "Proceed to Demo Checkout" opens modal dialog with honest demo disclaimer.
- [x] Submitting blank checkout form triggers inline field errors for Name, Email, Phone, Address, City, PIN.
- [x] Valid submission simulates order creation and displays confirmation with demo order number (`HH-XXXXXX`).

---

## 5. Common Issues & Troubleshooting

### Issue: Tailwind styles not applying after modifying classes
- **Cause**: Tailwind CSS v4 utilizes the `@tailwindcss/vite` plugin.
- **Fix**: Verify that `src/index.css` contains `@import "tailwindcss";` and that Vite development server has reloaded.

### Issue: Direct URL refresh on client route returns 404 in production
- **Cause**: Single-page apps need server rewrites for client-side routing.
- **Fix**: Ensure `vercel.json` contains the rewrite rule routing `/(.*)` to `/index.html`.

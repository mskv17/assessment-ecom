# Architecture & Technical Design

> Detailed system design, component boundaries, data flow diagrams, and architectural rationale for **Harvest & Hearth**.

---

## 1. Architectural Philosophy

The architecture of this storefront is built upon five guiding tenets:
1. **Decoupled Data Access (Repository Pattern)**: Components never import mock arrays or perform low-level fetch calls directly. They consume typed service interfaces (`IProductService`, `ICategoryService`), ensuring that frontend development can precede backend development with zero friction.
2. **Predictable Unidirectional Data Flow**: State flows down via props and context; user intentions flow up via typed service calls and event handlers.
3. **Resilience & Defensive UI**: Every asynchronous state transitions through explicit states (`Loading`, `Success`, `Empty`, `Error`). Failures offer actionable recovery options without displaying raw technical exceptions.
4. **Performance & Core Web Vitals First**: Every image has predefined dimensions or aspect-ratio classes to prevent Cumulative Layout Shift (CLS < 0.05). Heavy page views are code-split via `React.lazy`.
5. **Accessibility & Usability**: Full keyboard navigation, ARIA landmarks, visible focus rings, and touch targets $\ge 44\text{px}$.

---

## 2. System Architecture & Data Flow

```mermaid
flowchart TD
    User([User / Browser])
    
    subgraph UI Layer
        Header[Header & Quick Search]
        Pages[Pages: Home, Shop, PDP, 404]
        Cart[CartDrawer & Demo Checkout]
        Components[ProductCard, ProductGrid, Filters]
    end

    subgraph Custom Hooks Layer
        useProducts[useProducts Hook]
        useProduct[useProduct Hook]
        useCategories[useCategories Hook]
    end

    subgraph Service & Repository Layer
        Factory[Service Factory: services/index.ts]
        IProductService[IProductService Contract]
        ICategoryService[ICategoryService Contract]
        MockService[MockProductService + In-Memory Latency]
        HttpService[HttpProductService + apiClient]
        Analytics[AnalyticsService: trackEvent]
    end

    subgraph Data & Future API
        MockData[(Mock JSON: products.mock.ts)]
        LiveBackend[(Future REST API Server)]
    end

    User -->|Interacts| UI Layer
    Pages --> useProducts & useProduct & useCategories
    useProducts --> Factory
    useProduct --> Factory
    useCategories --> Factory
    Factory -->|VITE_USE_MOCK_DATA=true| MockService
    Factory -->|VITE_USE_MOCK_DATA=false| HttpService
    MockService --> MockData
    HttpService --> LiveBackend
    UI Layer --> Analytics
```

---

## 3. Component Boundaries & Responsibilities

### 3.1 Common UI Primitives (`src/components/common/`)
- **`Button`**: Highly accessible interactive button with 5 visual variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), loading spinner state, and full-width toggle.
- **`Badge`**: Status indicator pill used for discount savings percentages, stock alerts (`In Stock`, `Sold Out`), and dietary attributes (`Certified Organic`, `A2 Certified`).
- **`ImageWithFallback`**: Wraps the HTML `img` tag with an intrinsic aspect-ratio container (`aspect-square` or `aspect-4/3`) to eliminate layout shifts, rendering a shimmering placeholder until loaded and an elegant SVG fallback if the image fails.
- **`QuantitySelector`**: Accessible counter with plus/minus buttons, integer enforcement, and bounds checking.
- **`Skeleton` & `ProductCardSkeleton`**: CSS shimmer placeholders mirroring card dimensions during network latency.
- **`EmptyState`**: Friendly visual illustration, heading, description, and primary recovery button when searches or carts yield no items.
- **`ErrorState`**: Centralized error presentation supporting automatic and user-initiated retries.
- **`ErrorBoundary`**: Top-level React error boundary that intercepts uncaught rendering exceptions and provides a recovery page reload.

### 3.2 Layout & Global Components (`src/components/layout/`)
- **`Header`**: Sticky navigation containing brand identity, desktop menu links, live quick-search input with debouncing, and persistent cart badge.
- **`Footer`**: Contains trust indicators, farm certifications, category quick-links, legal notices, and an honest demo disclaimer.
- **`ScrollToTop`**: Route change listener that resets viewport scroll coordinates to `(0, 0)`.

### 3.3 Shopping Cart System (`src/components/cart/`)
- **`CartDrawer`**: Non-blocking slide-out drawer allowing customers to adjust item quantities, review subtotals, observe free-shipping progress, and launch checkout without leaving their active page.
- **`DemoCheckoutModal`**: Lightweight checkout form validated with Zod, confirming delivery details and order summary with an explicit prototype notice.

### 3.4 Product Catalog & PDP (`src/components/shop/` & `src/components/pdp/`)
- **`ProductCard`**: Card layout balancing imagery, title, pack size, price, savings badge, stock badge, and 1-tap quick add.
- **`ProductFiltersBar` & `ActiveFilters`**: Multi-dimensional filtering by category, price, in-stock status, and dietary tags with 1-click active filter removal.
- **`StickyMobileAddToCart`**: Conversion-rate-optimized floating bar pinned to the bottom of mobile screens when the customer scrolls past the primary buy box on product details pages.

---

## 4. State Management Strategy

### 4.1 Server / Catalog Data State (Custom Hooks)
Catalog querying is encapsulated within custom hooks (`useProducts`, `useProduct`, `useCategories`). Each hook manages:
- `data`: Typed domain entity or paginated result.
- `isLoading`: Boolean flag triggering skeleton loaders.
- `error`: Normalized `UserFriendlyError` object.
- `AbortController`: Automatically cancels in-flight fetch requests when components unmount or search parameters change.

### 4.2 Application / Cart State (`CartContext`)
Shopping basket state is held in a React Context backed by `localStorage`:
- Preserves basket contents across browser reloads.
- Automatically calculates item quantities, subtotal, discount savings, and free shipping thresholds.
- Dispatches CRO analytics events on mutation (`add_to_cart`, `remove_from_cart`).

### 4.3 URL State as Source of Truth
Filter and search parameters (`q`, `category`, `sort`, `inStock`, `tag`, `page`) are synchronized with the browser URL query string via `useSearchParams`. This guarantees:
- Users can bookmark specific filtered catalog views.
- Browser back and forward buttons navigate through search history predictably.

---

## 5. Design System Tokens & Aesthetics

The design system is styled using Tailwind CSS v4 configured with an artisanal, warm food palette:
- **Brand Primary (`#1B4332`)**: Deep Forest Green, symbolizing organic purity, botanical vitality, and agricultural heritage.
- **Accent Amber (`#D97706` / `#F59E0B`)**: Warm honey gold, accentuating harvest specials, savings badges, and calls-to-action.
- **Background Cream (`#FAF8F5`)**: Organic linen stone, avoiding stark clinical white for a warm culinary feel.
- **Typography**:
  - Headings: `Playfair Display`, serif, delivering classic artisanal elegance.
  - Body & UI: `Plus Jakarta Sans`, sans-serif, optimized for digital legibility and rapid scanning.

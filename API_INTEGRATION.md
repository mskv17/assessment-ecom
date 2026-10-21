# API Integration & Backend Contract Specification

> This document provides the complete API contract, endpoint definitions, JSON request/response schemas, error response formats, and instructions for connecting the frontend to a live REST backend.

---

## 1. Overview & Service Contract

The storefront interacts with catalog data exclusively through two typed TypeScript service contracts:
- **`IProductService`** (`src/services/contracts/IProductService.ts`)
- **`ICategoryService`** (`src/services/contracts/ICategoryService.ts`)

During the frontend-only phase, queries resolve through `MockProductService` with simulated network latency and in-memory filtering. Switching to a live backend is achieved entirely via environment configuration without modifying UI components.

---

## 2. Environment Configuration

To point the storefront to a live REST API backend:

```bash
# In .env or hosting environment variables:
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://api.harvesthearth.com/v1
```

When `VITE_USE_MOCK_DATA=false`, `src/services/index.ts` automatically instantiates `HttpProductService` and `HttpCategoryService`, which execute real HTTP requests via `apiClient`.

---

## 3. API Endpoints Specification

### 3.1 Get All Products
- **Method**: `GET`
- **Path**: `/products`
- **Description**: Returns all active products in the catalogue.
- **Query Parameters**: None
- **Response**: `200 OK`
```json
[
  {
    "id": "prod_ghee_01",
    "name": "A2 Vedic Bilona Cow Ghee",
    "slug": "a2-vedic-bilona-cow-ghee",
    "categoryId": "cat_oils",
    "shortDescription": "Cultured A2 Gir cow butter slow-cooked on firewood in traditional brass vats.",
    "description": "Handcrafted following authentic Ayurvedic Bilona methods...",
    "price": 1450,
    "compareAtPrice": 1750,
    "unitLabel": "500 ml Glass Jar",
    "imageUrl": "https://images.unsplash.com/photo-1627881907316-b8f416d8e622?auto=format&fit=crop&w=800&q=80",
    "stockQuantity": 14,
    "isFeatured": true,
    "isActive": true,
    "createdAt": "2026-03-01T08:00:00Z",
    "dietaryTags": ["A2 Certified", "Keto Friendly", "Lactose Free"],
    "origin": "Saurashtra, Gujarat",
    "ingredients": "100% Clarified Butter Fat from Cultured A2 Gir Cow Milk"
  }
]
```

---

### 3.2 Search & Filter Products (Paginated)
- **Method**: `GET`
- **Path**: `/products/search`
- **Query Parameters**:
  - `q` (string, optional): Search keyword against name, description, ingredients, or origin.
  - `category` (string, optional): Foreign key matching `Category.id`.
  - `minPrice` (number, optional): Minimum price in INR.
  - `maxPrice` (number, optional): Maximum price in INR.
  - `inStock` (boolean, optional): `true` to return items with `stockQuantity > 0` or `null`.
  - `tag` (string, optional): Specific dietary tag (e.g. `Certified Organic`).
  - `sortBy` (string, optional): One of `featured`, `price-asc`, `price-desc`, `newest`, `name-asc`.
  - `page` (number, default: 1): Page index (1-based).
  - `pageSize` (number, default: 12): Number of items per page.
- **Response**: `200 OK`
```json
{
  "items": [
    {
      "id": "prod_honey_01",
      "name": "Raw Himalayan Wild White Honey",
      "slug": "raw-himalayan-wild-white-honey",
      "categoryId": "cat_honey",
      "shortDescription": "Rare snow-white creamy honey gathered by wild cliff bees in alpine forests.",
      "description": "An extraordinary monofloral honey harvested sustainably at altitudes above 9,000 feet...",
      "price": 980,
      "compareAtPrice": 1200,
      "unitLabel": "400 g Glass Jar",
      "imageUrl": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      "stockQuantity": 9,
      "isFeatured": true,
      "isActive": true,
      "createdAt": "2026-03-08T15:20:00Z",
      "dietaryTags": ["100% Raw", "Wild Harvested", "Unpasteurized"],
      "origin": "Kullu Valley, Himachal Pradesh",
      "ingredients": "100% Pure Raw Wild Alpine Honey"
    }
  ],
  "total": 24,
  "page": 1,
  "pageSize": 12,
  "totalPages": 2
}
```

---

### 3.3 Get Product by Slug
- **Method**: `GET`
- **Path**: `/products/slug/:slug`
- **Path Parameters**:
  - `slug` (string, required): Clean URL slug (e.g. `cold-pressed-kashmiri-walnut-oil`).
- **Response**: `200 OK` returns product entity, or `404 Not Found` if nonexistent.

---

### 3.4 Get Related Products
- **Method**: `GET`
- **Path**: `/products/:id/related`
- **Query Parameters**:
  - `limit` (number, default: 4): Maximum items to return.
- **Response**: `200 OK` returns array of complementary products.

---

### 3.5 Get Featured Products
- **Method**: `GET`
- **Path**: `/products/featured`
- **Query Parameters**:
  - `limit` (number, default: 6): Maximum items to return.
- **Response**: `200 OK` returns array of featured showcase products.

---

### 3.6 Get Categories
- **Method**: `GET`
- **Path**: `/categories`
- **Response**: `200 OK`
```json
[
  {
    "id": "cat_oils",
    "name": "Artisanal Oils & Ghee",
    "slug": "oils-and-ghee",
    "description": "Cold-pressed extractions and slow-simmered A2 Bilona cow ghee.",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    "itemCount": 4,
    "iconName": "Droplet"
  }
]
```

---

## 4. Standardized Error Formats

The backend must format non-success responses as JSON:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Product with slug 'xyz' was not found",
    "status": 404
  }
}
```

| HTTP Status | Frontend Handling | User-Facing Action |
|---|---|---|
| `400 Bad Request` | Form/query validation error | Highlights erroneous field inline |
| `404 Not Found` | Navigates to designed `NotFoundPage` | Provides "Explore Fresh Pantry" recovery button |
| `408 Request Timeout` | Re-attempts query or reports timeout | Displays "Connection Interrupted" with retry button |
| `500+ Server Error` | Captured by service error normalizer | Shows friendly "Service Temporarily Unavailable" with retry |

---

## 5. Security & Request Cancellation Requirements

1. **AbortController**: All service methods forward an `AbortSignal`. The client will automatically abort pending HTTP calls if the user rapidly switches routes or enters new search keywords.
2. **CORS Headers**: The API backend must send standard CORS headers allowing the frontend origin:
   ```http
   Access-Control-Allow-Origin: * (or specific storefront domain)
   Access-Control-Allow-Methods: GET, POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Accept, Authorization
   ```
3. **No Frontend Secrets**: Never require backend API secret keys in client-side code or public environment variables.

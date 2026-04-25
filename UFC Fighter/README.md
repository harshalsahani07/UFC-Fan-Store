# UFC Fan Store + Fighter Hub

Full-stack final-year BCA project (student/demo use only, not affiliated with UFC).  
Tech stack: React + Tailwind, Node + Express, MongoDB, JWT.

## 1) Complete Project Architecture

```txt
UFC Fighter/
  backend/
    package.json
    .env.example
    src/
      app.js
      server.js
      config/
        db.js
      controllers/
        authController.js
        productController.js
        orderController.js
        fighterController.js
        adminController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
      models/
        User.js
        Product.js
        Order.js
        Fighter.js
        Review.js
        Coupon.js
      routes/
        authRoutes.js
        productRoutes.js
        orderRoutes.js
        fighterRoutes.js
        adminRoutes.js
      seed/
        seedData.js
      utils/
        jwt.js
  frontend/
    package.json
    index.html
    .env.example
    postcss.config.js
    tailwind.config.js
    vite.config.js
    src/
      main.jsx
      App.jsx
      index.css
      api/
        client.js
      context/
        AppContext.jsx
      components/
        Navbar.jsx
        ProtectedRoute.jsx
      pages/
        HomePage.jsx
        AuthPage.jsx
        ProductsPage.jsx
        ProductDetailsPage.jsx
        FightersPage.jsx
        FighterDetailsPage.jsx
        CartPage.jsx
        OrdersPage.jsx
        WishlistPage.jsx
        AdminDashboardPage.jsx
        AdminProductsPage.jsx
```

## 2) Database Schema (MongoDB Models)

- `User`: `name`, `email`, `passwordHash`, `role` (`admin`/`user`), `wishlistProducts`, `wishlistFighters`.
- `Product`: catalog entity with `name`, `description`, `price`, `stock`, `soldCount`, `category`, `isActive`.
- `Order`: checkout snapshot with `items`, `subtotal`, `discountAmount`, `totalAmount`, `couponCode`, statuses.
- `Fighter`: hub profile with `name`, `nickname`, division, record (`wins/losses/draws`), `bio`, `popularityScore`.
- `Review`: polymorphic review model for both products/fighters with rating + comment + user.
- `Coupon`: admin-managed discount engine with expiry and minimum order value.

Why this design:
- Review reuse avoids duplicate tables for product and fighter comments.
- Order snapshots keep historical pricing safe even if product prices change later.
- Popularity and sold-count enable trend analytics without expensive recomputation.

## 3) Backend (Express + Clean APIs)

### Server Setup
- `src/server.js`: env load, Mongo connect, app start.
- `src/app.js`: middleware + route mounting + health endpoint.

### APIs Implemented
- Auth:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Products:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products/:id/reviews`
  - `POST /api/products/:id/wishlist`
  - `GET /api/products/trending/top-selling`
- Orders:
  - `POST /api/orders` (mock payment + coupon handling)
  - `GET /api/orders/mine`
- Fighters:
  - `GET /api/fighters`
  - `GET /api/fighters/:id`
  - `POST /api/fighters/:id/ratings`
  - `POST /api/fighters/:id/wishlist`
  - `GET /api/fighters/trending/popular`
- Admin:
  - `GET /api/admin/analytics`
  - `POST /api/admin/products`
  - `PUT /api/admin/products/:id`
  - `DELETE /api/admin/products/:id` (soft-archive)
  - `POST /api/admin/fighters`
  - `PUT /api/admin/fighters/:id`
  - `POST /api/admin/coupons`

### Middleware
- `protect`: JWT validation and user injection.
- `requireRole`: role-based access guard.
- `notFound`, `errorHandler`: centralized API error handling.

### Business Logic Highlights
- Coupon discount in checkout with expiry/min value validation.
- Product sold-count increments when order placed.
- Fighter popularity auto-updated from fan ratings.
- Single review per user per entity enforced via unique indexes.

## 4) Frontend (React + Tailwind)

### Frontend Structure
- Routing in `App.jsx`.
- Global state in `AppContext` (auth, cart, dark mode).
- Axios client with JWT interceptor.

### Pages & Components
- Public: Home, Products, Product Details, Fighters, Fighter Details, Login, Signup.
- Customer-only: Cart, Orders, Wishlist.
- Admin-only: Admin Dashboard, Admin Product Management.
- Shared components: Navbar, ProtectedRoute.

### Routing
- Route guards ensure:
  - not logged in -> redirect to login.
  - logged in but not admin -> blocked from admin panel.

### State Management
- Context API used to manage:
  - user authentication state
  - cart items
  - dark mode preference

## 5) Step-by-Step Implementation Guide

### A. Setup Backend
1. `cd backend`
2. `cp .env.example .env` (or create `.env` manually on Windows)
3. Add `MONGO_URI` and `JWT_SECRET`.
4. `npm install`
5. Seed dummy data: `npm run seed`
6. Start backend: `npm run dev`

### B. Setup Frontend
1. `cd frontend`
2. `cp .env.example .env` (or create file manually)
3. Keep `VITE_API_URL=http://localhost:5000/api`
4. `npm install`
5. Start frontend: `npm run dev`

### C. Connect Backend + Frontend
- Frontend axios base URL points to backend API.
- JWT is stored in local storage and auto-injected into requests.

### D. Run Project
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- Seed users:
  - Admin: `admin@ufcstore.com` / `admin123`
  - User: `user@ufcstore.com` / `user123`

## 6) UI/UX Suggestions

- Use fight-night style theme: black background + red action accents.
- Hero banner with "Trending Fighters" + "Top Selling Gear" cards.
- Add skeleton loaders on page transitions for professional feel.
- Add toast notifications for cart/wishlist/review actions.
- In dark mode, keep contrast high for readability.
- Add animated KPI cards for admin dashboard.

## 7) Deployment (Free Hosting Options)

### Option 1 (Recommended): Render + Vercel + MongoDB Atlas
- Backend on Render (Web Service).
- Frontend on Vercel.
- Database on MongoDB Atlas free tier.

Steps:
1. Push project to GitHub.
2. Create MongoDB Atlas cluster and copy connection URI.
3. Deploy backend on Render:
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Env: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN=<frontend-url>`.
4. Deploy frontend on Vercel:
   - Root: `frontend`
   - Build: `npm run build`
   - Output: `dist`
   - Env: `VITE_API_URL=<render-backend-url>/api`
5. Update backend `CORS_ORIGIN` to Vercel URL and redeploy.

### Option 2: Railway (backend) + Netlify (frontend)
- Same env variables, same architecture.

## Extra Recommendations for Portfolio Quality

- Add integration tests (Jest + Supertest).
- Add image upload (Cloudinary) for admin products/fighters.
- Add pagination + filters + sorting.
- Add order status management UI for admin.


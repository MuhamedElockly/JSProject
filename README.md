# E-Commerce JS Project

An end-to-end e-commerce web application built with vanilla HTML/CSS/JS and a lightweight JSON server backend. It includes a customer storefront, seller dashboard, and admin panel with role-based flows.

## Quick Start

- Prerequisites:
  - Node.js (LTS)
  - json-server (install globally): `npm i -g json-server`
- Run mock backend:
  - `cd E-Commerce/DataBase`
  - `json-server --watch db.json --port 3000`
- Open the app:
  - Customer storefront: open `E-Commerce/Home/index.html`
  - Seller dashboard: open `E-Commerce/seller/SellerDashboard.html`
  - Admin panel: open `E-Commerce/Admin-Panel/Admin.html`

All frontends communicate with the JSON API at `http://localhost:3000`.

## Project Structure

```
E-Commerce/
  Admin-Panel/
    Admin.html, Admin.css, js/{dashboard.js, productManagement.js, userManagement.js}
  DataBase/db.json
  Home/
    index.html, style.css, script.js, profile-styles.css
  Images/
  Login/
    login.html, login.css, JS/login.js
  Register/
    register.html, register.css, JS/{register.js, utils.js}
  seller/
    SellerDashboard.html, SellerDashboard.css, js/{sellerDashboard.js, productForm.js}
```

## Roles and Features

### Customer (Storefront)
- Product browsing with search (by name/category) and only shows admin-approved products.
- Product cards with image, category, title, price; Add to Cart button.
- Cart popout with quantity controls (+/−), dynamic total, and checkout flow.
- Order creation:
  - Creates an order with status "Pending" and cart line items.
  - Persists to `POST /orders`; associated with the logged-in user.
- Order status badge and order history modal; pulls orders from `GET /orders?userId={id}`.
- Profile editing section (first/last name, email, password) with update via `PUT /users/{id}`.
- Session and cart persistence via `localStorage` (`User`, `Cart`, `orders`).

Relevant code: `Home/script.js`.

### Seller Dashboard
- Seller overview with stats:
  - Approved Products, Pending Products, Pending Orders (derived for the seller).
- Products management (for the logged-in seller):
  - List and paginate products belonging to the seller.
  - Search by name/category/status.
  - Add Product (modal, client-side validation, image URL preview) → `POST /products` with `status: "Pending"` and `sellerId`.
  - Edit/Delete Product with confirmation modals.
- Orders (seller scope):
  - Lists "Pending" orders that include items from the seller.
  - View order details (modal) with line-item totals for the seller's items only.
  - Approve/Delete order actions via `PATCH /orders/{id}` and `DELETE /orders/{id}`.
- Logout clears session and redirects to login.

Relevant code: `seller/SellerDashboard.html`, `seller/js/sellerDashboard.js`, `seller/js/productForm.js`.

### Admin Panel
- Dashboard metrics placeholders (Total Users, Total Products, Pending Approval).
- Users management:
  - Fetch users, search (name/email/role), paginate.
  - Change role (admin/seller/user) via `PATCH /users/{id}` with confirmation modal.
  - Delete user with confirmation; success overlays.
- Products management:
  - Fetch products, search (name/category/status), paginate.
  - Approve product (sets `status: "Approved"`) and Delete product; confirmation + success overlays.
  - Pending approval count derived from products with `status === "Pending"`.

Relevant code: `Admin-Panel/js/{dashboard.js, userManagement.js, productManagement.js}`.

### Authentication and Registration
- Registration form with validation (first/last name, email, password, gender, role selection).
- Role options: Customer or Seller.
- Login form with email/password fields.
- Session is stored in `localStorage` under `User` (and Seller pages read `currentUser` as well).

Relevant files: `Register/register.html`, `Register/JS/{register.js, utils.js}`, `Login/login.html`, `Login/JS/login.js`.

## Data Model (JSON Server)
- Users: `/users`
  - Fields include `id, firstName, lastName, email, password, role` (e.g., `admin`, `seller`, `user/customer`), and optional `gender`.
- Products: `/products`
  - Fields include `id, name, category, price, sellerId, status` (`Pending`|`Approved`), `imageUrl`.
- Orders: `/orders`
  - Fields include `id, userId, userName, userEmail, date, status` (`Pending`|`Approved`), `cart[]` with per-line `productId, name, price, quantity, sellerId, imageUrl, category`, and `totalAmount`.
- Reviews: `/review` (optional, created from storefront review prompt).

Actual seed data and current state are in `E-Commerce/DataBase/db.json`.

## API Endpoints (json-server)
- `GET /products`, `POST /products`, `PATCH /products/{id}`, `DELETE /products/{id}`
- `GET /users`, `PATCH /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}`
- `GET /orders`, `GET /orders?userId={id}`, `POST /orders`, `PATCH /orders/{id}`, `DELETE /orders/{id}`
- `POST /review`

## Image Handling
- Product images typically referenced by URL in `imageUrl`.
- If `imageUrl` starts with `/`, UI prepends `.` for relative loading from project assets.

## Notes and Conventions
- All UIs expect the API at `http://localhost:3000`.
- Role-based navigation is manual via the different HTML entry points.
- Persistent state is handled with `localStorage` for session and cart.
- Pagination and search are client-side.

## Scripts/How-To
- Start backend: `json-server --watch E-Commerce/DataBase/db.json --port 3000`
- Open any frontend HTML file directly in a browser (or via a static server).
- For best results, run with a local static server (e.g., VS Code Live Server) to avoid CORS/file path issues.

## Roadmap Ideas
- Centralize auth/session handling and unify `currentUser` vs `User` keys.
- Add role-based route guards.
- Enhance admin dashboard metrics with real counts.
- Add order lifecycle beyond Pending/Approved (e.g., Shipped/Delivered).
- Image upload handling and CDN-friendly paths.

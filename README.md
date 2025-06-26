# 📘️ Merch Server – Fullstack Documentation

## 📌 Overview

The **Merch Server** is a fullstack e-commerce platform with:

* A **Node.js + Express + MongoDB** backend
* A **React.js** frontend (deployed separately)
* Features: user authentication, product listings, cart, wishlist, reviews, order tracking, admin dashboard, and real-time updates

This documentation includes structure, technologies, key API routes, and setup instructions for both backend and frontend.

---

## 📁 Folder Structure (Backend)

```
server/
├── config/                 # Cloudinary, Email, and reCAPTCHA configuration
├── controllers/            # Route logic (users, products, orders, etc.)
├── middlewares/            # JWT auth, multer uploads, role checks
├── Models/                 # Mongoose schemas
├── routes/                 # Express route definitions
├── socket.js               # WebSocket setup (Socket.io)
├── index.js                # Entry point
├── .env                    # Environment variables
├── package.json            # Dependencies
```

## 📁 Folder Structure (Frontend)

```
client/
├── build/                      # Production build output (generated after `npm run build`)
├── node_modules/              # Node dependencies (auto-generated)
├── public/                    # Static assets (e.g., index.html, favicon)
│
├── src/                       # Main source code
│   ├── assets/                # Images, icons, fonts, and other static resources
│   ├── components/            # Reusable React UI components
│   ├── context/               # React context providers (e.g., AuthContext, CartContext)
│   ├── hooks/                 # Custom React hooks for shared logic
│   ├── pages/                 # Main pages used in routing (e.g., Home, Login, Profile)
│   ├── services/              # API service calls or utility functions (e.g., Axios instances)
│   ├── App.js                 # Main application component
│   ├── index.js               # React app entry point
│   └── index.css              # Global Tailwind and custom CSS
│
├── .env.local                 # Local environment variables (not committed)
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Auto-generated dependency tree lock file
├── postcss.config.js          # PostCSS configuration (used with Tailwind)
├── tailwind.config.js         # Tailwind CSS configuration
```

---

## 🛠️ Technologies Used

| Category           | Technology / Description                   |
| ------------------ | ------------------------------------------ |
| Backend Framework  | Express (Node.js)                          |
| Frontend Framework | React.js (Create React App)                |
| Database           | MongoDB with Mongoose                      |
| Authentication     | JWT, bcryptjs                              |
| Image Upload       | Cloudinary, Multer                         |
| Email              | Nodemailer                                 |
| CAPTCHA            | Google reCAPTCHA v3                        |
| Real-time Updates  | Socket.io                                  |
| Env Config         | dotenv                                     |
| API Testing        | Postman                                    |
| Deployment         | Backend: Render, Frontend: Vercel          |
| UI Library         | React – JavaScript library for building UI |
| CSS Framework      | Tailwind CSS – Utility-first CSS framework |
| CSS Processing     | PostCSS – used with Tailwind               |
| State Management   | Context API – global state (auth, cart)    |
| HTTP Client        | Axios – for API calls                      |
| Syntax Extension   | JSX – React syntax extension               |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:dcdfoodsfranchising/dcd-merch.git
cd dcd-merch
```

### 2. Install Dependencies

```bash
npm install     # backend
npm install     # frontend (in /client)
```

### 3. Create `.env` Files

#### Backend `.env`

```
PORT=3000
MONGODB_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CAPTCHA_SECRET_KEY=your_recaptcha_key
```

#### Frontend `.env`

```
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_RECAPTCHA_SITE_KEY=your_site_key
```

### 4. Run Locally

```bash
# Backend
npm run dev

# Frontend
cd client
npm start
```

---

## 📦 Full API Route Reference

### 🔬 API Structure Summary

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| POST   | /api/users/register           | Register a new user         |
| POST   | /api/users/login              | Login with email/password   |
| GET    | /api/products/active          | Fetch all active products   |
| POST   | /api/cart/add                 | Add product to cart         |
| POST   | /api/orders/checkout          | Place order from cart       |
| GET    | /api/orders/my-orders         | Get logged-in user's orders |
| POST   | /api/reviews                  | Submit a product review     |
| GET    | /api/reviews/\:productId      | Fetch product reviews       |
| POST   | /api/wishlist/add/\:productId | Add to wishlist             |

### 👤 User Routes

| Method | Endpoint                            | Description                           |
| ------ | ----------------------------------- | ------------------------------------- |
| POST   | /api/users/register                 | Register user with email confirmation |
| POST   | /api/users/confirm-email            | Confirm registration code             |
| POST   | /api/users/resend-confirmation-code | Resend confirmation email             |
| POST   | /api/users/login                    | Login with CAPTCHA verification       |
| POST   | /api/users/verify-login-code        | Verify login code                     |
| GET    | /api/users/details                  | Get user details                      |
| PATCH  | /api/users/\:id/set-as-admin        | Promote user to admin                 |
| PATCH  | /api/users/update-password          | Change password                       |
| PATCH  | /api/users/update-details           | Update personal details               |
| PATCH  | /api/users/update-username          | Change display name                   |
| POST   | /api/users/upload-profile-picture   | Upload profile picture                |

### 🛒 Product Routes

| Method | Endpoint                                  | Description                      |
| ------ | ----------------------------------------- | -------------------------------- |
| POST   | /api/products                             | Create product with images       |
| GET    | /api/products/all                         | Get all products (admin)         |
| GET    | /api/products/active                      | Get all active products          |
| GET    | /api/products/\:productId                 | Get single product by ID         |
| PATCH  | /api/products/\:productId/update          | Update product info              |
| PATCH  | /api/products/\:productId/archive         | Archive product                  |
| PATCH  | /api/products/\:productId/activate        | Activate product                 |
| DELETE | /api/products/\:productId                 | Delete product                   |
| POST   | /api/products/search-by-name              | Search products by name          |
| POST   | /api/products/search-by-price             | Filter products by price         |
| POST   | /api/products/\:productId/add-stock       | Add stock to product             |
| PATCH  | /api/products/\:productId/feature         | Toggle as featured               |
| POST   | /api/products/\:productId/upload-images   | Upload or replace product images |
| PATCH  | /api/products/\:productId/update-quantity | Update stock after order         |
| DELETE | /api/products/\:productId/delete-image    | Delete specific image            |

### 📆 Order Routes

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| POST   | /api/orders/checkout         | Checkout from cart            |
| POST   | /api/orders/buy-now          | Direct order                  |
| POST   | /api/orders/buy-again        | Reorder from history          |
| GET    | /api/orders/my-orders        | View logged-in user's orders  |
| GET    | /api/orders/all-orders       | Admin view of all orders      |
| PATCH  | /api/orders/\:orderId/cancel | Cancel order                  |
| PATCH  | /api/orders/update-status    | Admin: update delivery status |

---

## 🧩 Key Features by Module

### 👤 User

* Register, confirm, resend code
* CAPTCHA login with optional OTP
* Upload profile photo
* Change password/username
* Promote to admin

### 🛒 Product

* Add, update, archive/activate
* Cloudinary image upload
* Stock control
* Search by name/price
* Mark as featured

### 🛒 Cart

* Add/remove items
* Update quantity
* Checkout
* Recalculate totals in real-time

### 📆 Orders

* Place, reorder, or cancel orders
* Admin order status updates

### 🚚 Delivery

* Manage delivery addresses
* Admin can view/remove outdated entries

### 📝 Reviews

* Submit after delivery only
* Anonymity, image uploads, tags
* Helpful/unhelpful voting
* Admin moderation

### 💖 Wishlist

* Add/remove/view wishlisted items
* Check item status

### 🔐 Authentication & Authorization

* JWT Auth: `Authorization: Bearer <token>`
* Middleware chain:

```js
app.get("/api/orders/my-orders", verify, verifyUser, getOrders);
```

| Middleware  | Description         |
| ----------- | ------------------- |
| verify      | Auth via JWT        |
| verifyUser  | Regular user access |
| verifyAdmin | Admin-only access   |

### 📢 WebSocket (Socket.io)

* Live updates on:

  * New orders
  * Stock events
  * Admin dashboard changes

### 🛏️ CAPTCHA (Login Security)

* reCAPTCHA v3 (score-based)
* Minimum threshold: 0.5
* Applied to `/login` endpoint

### 🧪 API Testing

* Fully tested via Postman
* Auth + no-auth flows
* Edge cases handled
* Includes media & validation testing

### 🗃️ Error Handling

```json
{
  "error": {
    "message": "Something went wrong",
    "errorCode": "SERVER_ERROR",
    "details": null
  }
}
```

Handled via centralized middleware.

### 📊 Admin Dashboard Summary API

* **Endpoint:** `/api/admin/summary`
* **Supports:**

  * `daily` (with date)
  * `monthly` (with month, year)
  * `yearly` (with year)
* **Returns:**

  * Total sales
  * Order status breakdown
  * Bestsellers
  * Sales graph data
  * Recent orders
  * Total ordering users

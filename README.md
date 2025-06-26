# 📘 Merch Server – Fullstack Documentation

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
├── public/                 # Static assets, favicon, etc.
├── src/
│   ├── assets/             # Images, logo
│   ├── components/         # Reusable UI components
│   ├── context/            # Auth and global state
│   ├── pages/              # Route-based page views
│   ├── App.js              # Root component
│   └── main.jsx            # ReactDOM entry
├── .env                    # Frontend env variables
├── package.json            # Frontend dependencies
```

---

## 🛠️ Technologies Used

| Purpose            | Tech Used             |
| ------------------ | --------------------- |
| Backend Framework  | Express (Node.js)     |
| Frontend Framework | React.js              |
| Database           | MongoDB with Mongoose |
| Authentication     | JWT, bcryptjs         |
| Image Upload       | Cloudinary, Multer    |
| Email              | Nodemailer            |
| CAPTCHA            | Google reCAPTCHA v3   |
| Real-time Updates  | Socket.io             |
| Env Config         | dotenv                |
| API Testing        | Postman               |
| Deployment         | Render                |

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
yarn install    # frontend (in /client)
```

### 3. Create `.env` Files

#### Backend `.env`

```
PORT=3000
MONGODB_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CAPTCHA_SECRET_KEY=your_recaptcha_key
```

#### Frontend `.env`

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

### 4. Run Locally

```bash
# Backend
npm run dev

# Frontend
cd client
npm run dev
```

---

## 🔬 API Structure Summary

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| POST   | /api/users/register           | Register a new user         |
| POST   | /api/users/login              | Login with email/password   |
| GET    | /api/products                 | Fetch all active products   |
| POST   | /api/cart/add                 | Add product to cart         |
| POST   | /api/orders                   | Place order from cart       |
| GET    | /api/orders/user              | Get logged-in user's orders |
| POST   | /api/reviews                  | Submit a product review     |
| GET    | /api/reviews/\:productId      | Fetch product reviews       |
| POST   | /api/wishlist/add/\:productId | Add to wishlist             |

---

## 🪡 Key Features by Module

### 👤 User

* Register, confirm email, resend code
* CAPTCHA-verified login with optional code
* Upload profile photo
* Change password or username
* Promote to admin (admin-only)

### 🛒 Product

* Add, update, archive/activate product
* Manage images & stock per variant
* Search by name or price range
* Toggle featured products

### 🛒 Cart

* Add item (check variant stock)
* Update item quantity
* Remove or clear cart
* Recalculate total in real time

### 📆 Orders

* Place order (from cart or buy now)
* Admin status update: pending → shipped
* Cancel order (restores stock)
* Buy again using past orders

### 🚚 Delivery

* Save or update delivery info (name, tag, notes)
* Fetch own details or all (admin)
* Delete outdated delivery data

### 📝 Reviews

* Review only after delivery
* Anonymous option, image upload
* Tag support and star rating
* Vote helpful/unhelpful
* Admin reply, hide, delete, report review

### 💖 Wishlist

* Add or remove products
* Fetch entire wishlist
* Check if item is in wishlist

---

## 🔐 Authentication & Authorization

* JWT issued after login: `Authorization: Bearer <token>`
* Middleware flow:

  1. `verify` → decode and attach `req.user`
  2. `isLoggedIn`, `verifyAdmin`, or `verifyUser`

```js
// Example
app.get("/api/orders/user", verify, isLoggedIn, getUserOrders);
```

---

## 📢 WebSocket (Socket.io)

* Listens on new order creation
* Emits live updates for admin dashboard

---

## 🛏️ CAPTCHA (Login Security)

* Uses Google reCAPTCHA v3 (score-based)
* Denies login if score < 0.5
* Verified during login endpoint

---

## 🧪 API Testing

* All controllers tested using **Postman**
* Includes:

  * Successful responses
  * Edge case handling
  * Authenticated/unauthenticated flows

---

## 🌐 Deployment

* Backend is deployed via **Render**
* Cloudinary handles asset uploads
* MongoDB Atlas is used for cloud database

---

## 🗃️ Error Handling

Standard error response format:

```json
{
  "error": {
    "message": "Something went wrong",
    "errorCode": "SERVER_ERROR",
    "details": null
  }
}
```

All errors are centralized using middleware in `auth.js`.

---

## 📊 Admin Dashboard Summary API

### Endpoint: `/api/admin/summary`

Supports filtering by:

* `daily` (requires `date`)
* `monthly` (requires `month` & `year`)
* `yearly` (requires `year`)

Returns:

* Total sales
* Order summary (status breakdown)
* Best-selling products
* Monthly sales graph data
* Recent orders
* Total users with orders

---

## 🎓 Contributing

PRs welcome! Please open an issue first for feature suggestions or bugs.

---

## 📄 License

MIT — free for personal/commercial use with credit.

---

## ✨ Maintainers

* [DCD Foods Franchising](https://github.com/dcdfoodsfranchising)
* Backend by: `@yournamehere`

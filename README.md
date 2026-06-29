# ReSell Hub

## Project Name

**ReSell Hub – Second-Hand Marketplace Platform**

## Project Purpose

ReSell Hub is a modern second-hand marketplace platform where users can buy and sell pre-owned products safely and efficiently. The platform helps reduce waste, promotes sustainable consumption, and creates opportunities for users to earn money from unused items. Buyers can browse products, save wishlist items, place orders, and make secure payments, while sellers can list products and manage their business. Admins can monitor users, products, orders, and platform activity.

## Live URL

**Live Site:** https://resell-hub-rho.vercel.app

**Backend API:** https://resell-hub-server-two.vercel.app




## Key Features

### Authentication & Authorization

* Email and password registration/login using Better Auth
* Google social login
* Secure logout system
* Role-based access control for Buyer, Seller, and Admin
* Protected private routes
* Protected backend APIs
* Private routes remain logged in after reload

### Public Pages

* Home page with hero banner, CTA buttons, statistics, featured products, popular categories, success stories, sustainability impact, marketplace statistics, and trusted sellers showcase
* All Products page
* Product Details page
* Categories page
* About Us page
* Contact Us page
* Login page
* Register page
* Custom 404 page
* Professional loading page with skeleton UI

### Buyer Features

* Buyer dashboard overview
* View total orders, wishlist count, and recent activity
* Browse products
* View product details
* Add products to wishlist
* Remove products from wishlist
* Place orders through checkout
* Stripe secure payment
* View order history
* View payment history
* Update profile information

### Seller Features

* Seller dashboard overview
* Add new product listings
* Upload product image using ImgBB
* Manage own products
* Edit product information
* Delete products
* View seller orders
* Manage order status
* View sales analytics with charts

### Admin Features

* Admin dashboard overview
* View total users, total products, total orders, and revenue
* Manage users
* Update user status
* Delete users
* Manage all products
* Approve or reject product listings
* Delete products
* Manage all orders
* Monitor payment and platform activity
* View platform analytics

### Product & Marketplace Features

* Dynamic featured products from database
* Dynamic popular categories from database
* Product search
* Category filtering
* Advanced filtering
* Price sorting: Low to High and High to Low
* Pagination on All Products page
* Product stock management
* Out-of-stock product checkout protection
* Product condition, category, seller, and status display

### Payment Features

* Stripe payment gateway integration
* Secure card payment
* Checkout page with order summary
* Delivery information form
* Cancel checkout option
* Payment success page
* Transaction ID display
* Payment amount display
* Payment date display
* Order created after successful payment
* Payment information stored in database
* Buyer payment history

### UI/UX Features

* Modern marketplace design
* Professional color combination
* Responsive layout for mobile, tablet, and desktop
* Responsive dashboard sidebar
* Consistent heading, spacing, button, and card design
* Framer Motion animations
* Equal height product cards
* Skeleton loading UI
* Custom error and not-found experience

### Extra Sections

* Sustainability Impact section
* Trusted Sellers Showcase section
* Buyer and seller Success Stories section

### Optional Features Implemented

* Advanced Product Filtering
* Seller Verification / Trusted Seller Badge Showcase

## Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* Framer Motion
* Axios
* Better Auth Client
* Stripe.js
* React Stripe.js
* Lucide React
* Recharts
* HeroUI

### Backend

* Node.js
* Express.js
* MongoDB
* Better Auth
* Stripe
* CORS
* Dotenv

### Database

* MongoDB Atlas

### Deployment

* Frontend deployed on Vercel
* Backend deployed on Vercel

## NPM Packages Used

### Frontend Packages

* next
* react
* react-dom
* tailwindcss
* framer-motion
* axios
* better-auth
* @stripe/stripe-js
* @stripe/react-stripe-js
* lucide-react
* recharts
* @heroui/react
* @gravity-ui/icons

### Backend Packages

* express
* mongodb
* cors
* dotenv
* better-auth
* stripe
* cookie-parser

## Environment Variables

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_APP_URL=your_frontend_live_url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### Backend Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=your_frontend_live_url
BETTER_AUTH_URL=your_backend_live_url
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## How to Run Locally

### Clone the repositories

```bash
git clone your-client-repository-link
git clone your-server-repository-link
```

### Run the frontend

```bash
cd client
npm install
npm run dev
```

### Run the backend

```bash
cd server
npm install
npm run dev
```

## Important Routes

### Public Routes

* `/`
* `/products`
* `/categories`
* `/about`
* `/contact`
* `/login`
* `/register`

### Buyer Routes

* `/dashboard/buyer`
* `/dashboard/buyer/orders`
* `/dashboard/buyer/wishlist`
* `/dashboard/buyer/payments`
* `/dashboard/buyer/profile`

### Seller Routes

* `/dashboard/seller`
* `/dashboard/seller/add-product`
* `/dashboard/seller/my-products`
* `/dashboard/seller/manage-orders`
* `/dashboard/seller/analytics`
* `/dashboard/seller/profile`

### Admin Routes

* `/dashboard/admin`
* `/dashboard/admin/users`
* `/dashboard/admin/products`
* `/dashboard/admin/orders`
* `/dashboard/admin/analytics`

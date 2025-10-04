# Trendyx - Full Stack E-commerce Platform

A modern, full-featured e-commerce platform built with the MERN stack. Shop from a wide variety of products with a seamless shopping experience, admin management, and secure payment processing.

## Features

- 🛍️ **Complete E-commerce Solution**: Full-featured online shopping platform
- 👤 **Dual User Roles**: Separate interfaces for customers and administrators
- 🛒 **Shopping Cart**: Add, remove, and manage items in your cart
- 💳 **Secure Payments**: Integrated Stripe payment processing
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔍 **Product Search & Filtering**: Find products easily with advanced search
- ⭐ **Product Reviews**: Rate and review products
- 📦 **Order Management**: Complete order tracking and history
- 👨‍💼 **Admin Dashboard**: Comprehensive admin panel for product and order management
- 🔒 **Secure Authentication**: JWT-based user authentication and authorization

## Personal Info (Demo / Default Profile)

- **Name:** Arbaz Ahmad Ansari
- **Email:** arbazahmadansari03@gmail.com
- **Phone:** 7983297137
- **Education:** MCA Student, Galgotias University
- **Skills:** MERN Stack Developer

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data storage
- **JWT** for authentication
- **Stripe** for payment processing
- **bcryptjs** for password hashing
- **Cloudinary** for image management
- **Jest** for testing

### Frontend
- **React 18** with hooks
- **Tailwind CSS** for styling
- **Material-UI** components
- **React Router** for navigation
- **Redux Toolkit** for state management
- **Axios** for API calls
- **Vite** for build tooling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arbaz-Ansari-ABM/Trendyx-Full-Stack.git
   cd Trendyx
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/trendyx
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the development servers**

   Backend (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## Usage

### For Customers
1. **Browse Products**: Explore our wide range of products
2. **Search & Filter**: Use search and filters to find specific items
3. **Add to Cart**: Add desired products to your shopping cart
4. **Checkout**: Complete your purchase with secure payment
5. **Track Orders**: View your order history and status

### For Administrators
1. **Product Management**: Add, edit, and manage product inventory
2. **Order Processing**: View and process customer orders
3. **Analytics**: Monitor sales and performance metrics
4. **User Management**: Manage customer accounts and permissions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/shop/products` - Get all products
- `GET /api/shop/products/:id` - Get specific product
- `GET /api/shop/search/:keyword` - Search products

### Cart
- `POST /api/shop/cart/add` - Add item to cart
- `GET /api/shop/cart` - Get user's cart
- `PUT /api/shop/cart/update` - Update cart item
- `DELETE /api/shop/cart/:id` - Remove item from cart

### Orders
- `POST /api/shop/order/create` - Create new order
- `GET /api/shop/order/list` - Get user's orders
- `GET /api/shop/order/details/:id` - Get order details

### Admin Endpoints
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create new product (admin)
- `PUT /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)
- `GET /api/admin/orders` - Get all orders (admin)

## Project Structure

```
Trendyx/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── assets/      # Images and static files
│   ├── public/          # Public assets
│   └── package.json
├── server/              # Node.js Backend
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── helpers/         # Utility functions
│   └── server.js        # Express server
└── README.md
```

## Key Features Explained

### Shopping Experience
- **Product Catalog**: Browse products with categories and filters
- **Product Details**: Detailed product pages with images and reviews
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout Process**: Streamlined checkout with address and payment
- **Order Tracking**: Real-time order status updates

### Admin Features
- **Dashboard**: Comprehensive admin dashboard with analytics
- **Product Management**: Full CRUD operations for products
- **Order Management**: Process and manage customer orders
- **Inventory Tracking**: Monitor stock levels and availability

### Security Features
- **JWT Authentication**: Secure user authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS Configuration**: Secure cross-origin resource sharing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using React, Node.js, and modern web technologies

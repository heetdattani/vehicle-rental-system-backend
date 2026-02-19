# Vehicle Rental System Backend

A comprehensive REST API backend for a vehicle rental management system built with Node.js, Express, and MongoDB. This application handles user authentication, vehicle management, and booking operations with real-time updates using Socket.io.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Scripts](#scripts)
- [Middleware](#middleware)
- [Contributing](#contributing)

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Vehicle Management**: Create, read, update, and delete vehicle inventory
- **Booking System**: Reserve vehicles with date range and availability checking
- **Admin Panel**: Dedicated admin middleware for administrative operations
- **Real-time Updates**: Socket.io integration for real-time notifications
- **Data Validation**: Joi-based request validation for all endpoints
- **Role-Based Access Control**: Admin and user role management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.2.1
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Hashing**: bcryptjs v3.0.3
- **Real-time**: Socket.io v4.8.3
- **Validation**: Joi v18.0.2
- **CORS**: cors v2.8.6
- **Environment**: dotenv v16.4.5

## Project Structure

```
vehicle-rental-system-backend/
├── config/
│   └── db.js              # Database connection setup
├── controllers/
│   ├── authController.js  # Authentication logic (login, register)
│   ├── bookingController.js # Booking operations
│   └── vehicleController.js # Vehicle CRUD operations
├── middleware/
│   ├── adminMiddleware.js # Admin authorization
│   └── authMiddleware.js  # JWT verification
├── models/
│   ├── User.js            # User schema
│   ├── Vehicle.js         # Vehicle schema
│   └── Booking.js         # Booking schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── bookingRoutes.js   # Booking endpoints
│   └── vehicleRoutes.js   # Vehicle endpoints
├── socket/
│   └── socket.js          # Socket.io event handlers
├── validations/
│   ├── authValidation.js  # Auth request validation
│   ├── bookingValidation.js # Booking validation
│   └── vehicleValidation.js # Vehicle validation
├── scripts/
│   ├── createAdmin.js     # Admin user creation script
│   └── seedVehicles.js    # Vehicle database seeding
├── server.js              # Main server entry point
├── package.json
├── .env                   # Environment variables (not in repo)
└── README.md
```

## Installation

### Prerequisites

- Node.js (v20.19 or higher)
- MongoDB (local or Atlas cloud database)
- npm or yarn package manager

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/heetdattani/vehicle-rental-system-backend.git
   cd vehicle-rental-system-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp env-copy.text .env
   # Edit .env with your configuration
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Note**: Refer to `env-copy.text` for all required environment variables.

## Running the Server

### Development Mode

With automatic restart on file changes:

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on the configured `PORT` (default: 5000) and display:

```
Server running on port 5000
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Login user (returns JWT) |
| POST   | `/api/auth/logout`   | Logout user              |
| GET    | `/api/auth/me`       | Get current user profile |

### Vehicle Routes (`/api/vehicles`)

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/vehicles`     | Get all vehicles       |
| GET    | `/api/vehicles/:id` | Get vehicle by ID      |
| POST   | `/api/vehicles`     | Create vehicle (Admin) |
| PUT    | `/api/vehicles/:id` | Update vehicle (Admin) |
| DELETE | `/api/vehicles/:id` | Delete vehicle (Admin) |

### Booking Routes (`/api/bookings`)

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/bookings`     | Get user's bookings |
| GET    | `/api/bookings/:id` | Get booking by ID   |
| POST   | `/api/bookings`     | Create new booking  |
| PUT    | `/api/bookings/:id` | Update booking      |
| DELETE | `/api/bookings/:id` | Cancel booking      |

## Database Schema

### Users

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  phone: String,
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicles

```javascript
{
  make: String (required),
  model: String (required),
  year: Number,
  licensePlate: String (unique, required),
  type: String (enum: ['sedan', 'suv', 'truck', 'van']),
  capacity: Number,
  pricePerDay: Number,
  status: String (enum: ['available', 'rented', 'maintenance']),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings

```javascript
{
  userId: ObjectId (ref: User),
  vehicleId: ObjectId (ref: Vehicle),
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

The system uses **JWT (JSON Web Tokens)** for authentication:

1. **Register/Login**: User provides credentials, receives JWT token
2. **Token Storage**: Client stores JWT in headers or local storage
3. **Protected Routes**: JWT verified via `authMiddleware`
4. **Token Expiry**: Configured via `JWT_EXPIRE` environment variable

### Auth Headers

```
Authorization: Bearer <jwt_token>
```

## Scripts

### Create Admin User

```bash
npm run create-admin
```

Prompts for admin credentials and creates an admin user in the database.

### Seed Sample Vehicles

```bash
npm run seed-vehicles
```

Populates the database with sample vehicle data for testing.

## Middleware

### `authMiddleware`

Verifies JWT token on protected routes. Extracts user information and attaches to request object.

### `adminMiddleware`

Checks user role is 'admin'. Used for admin-only operations like creating vehicles.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

ISC

## Support

For issues, questions, or suggestions, please open an issue in the repository.

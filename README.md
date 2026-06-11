#  WanderBee — Premium Hotel Booking & Host Management Platform

WanderBee is a premium, full-stack hotel stay booking platform and host dashboard application designed for modern travelers and property owners. It provides a dual-sided marketplace featuring a consumer-facing booking application and a dedicated host management portal ("Owner Suite") for managing room listings, pricing, and bookings in real-time.

---

## ✨ Features

### 👤 Guest Experience
* **Interactive Home Page**: Dynamic hero banner, curated destination recommendations, exclusive offers, and testimonial carousels.
* **Smart Search & Filters**: Search hotels by city, price range, and premium amenities with filter drawer options on mobile viewports.
* **Premium Suite Details**: Responsive image galleries, price details, interactive suite maps, cancellation policies, and listing amenities.
* **Integrated Bookings**: Secure booking wizard including transaction flows.

### 👑 Owner Suite (Host Dashboard)
* **Real-time Analytics**: High-level KPIs representing total bookings and revenue generated.
* **Room Inventory Management**: 
  * Responsive room listing tables with status toggles (Active vs. Paused).
  * Quick-edit pricing forms with inline validation.
* **Listing Creators**: Forms to upload up to 4 high-definition gallery images, define suite classifications, and toggle premium amenities.
* **Seamless Mobile Interface**: Custom fixed bottom navigation bar on mobile, optimized tables with text-truncation, and scaled control inputs.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, React Router v7, Tailwind CSS v4, Axios, React Hot Toast |
| **Backend** | Node.js, Express, Nodemailer |
| **Authentication** | Clerk Auth (Federated Identity & Session Management) |
| **Styling** | Vanilla Tailwind CSS (Custom themes, HSL color palettes, responsive design) |

---

## 📂 Project Structure

```bash
hotel-booking/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Navbar, Footer, Owner Sidebar)
│   │   ├── pages/       # Page components (Home, RoomDetails, Owner Dashboard)
│   │   ├── context/     # AppContext for global state management
│   │   ├── assets/      # Static resources (logos, images, icons)
│   │   └── App.jsx      # Routes & layout wrappers
│   └── package.json
└── server/              # Backend Express application
    ├── configs/         # Database and email configurations
    ├── controllers/     # Route controller functions (User, Booking, Rooms)
    ├── models/          # MongoDB/Mongoose schemas
    ├── routes/          # API endpoint routes
    └── server.js        # Main entrypoint file
```

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** or **yarn**

### 1. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your variables:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   EMAIL_USER=your_nodemailer_email
   EMAIL_PASS=your_nodemailer_password
   ```
4. Start the backend dev server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your variables:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_CURRENCY=₹
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🔒 Authentication Flow
WanderBee integrates **Clerk** authentication. When a user logs in, the backend intercepts the Clerk session tokens to verify their role:
* **Guests** have access to search and check out rooms.
* **Hotel Owners** are directed to the `/owner` Layout. The app implements loading-state protection (`isOwnerLoaded`), preventing redirect loops on page refreshes and ensuring a smooth user experience.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

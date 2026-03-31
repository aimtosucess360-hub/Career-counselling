<<<<<<< HEAD
# 🎓 CareerGuide – MERN Career Counselling Web App

A complete, production-ready **Career Counselling Web Application** for students after **10th and 12th standard**, built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 📁 Complete Project Structure

```
career-counselling/               ← Root folder
│
├── package.json                  ← Root scripts (run both servers together)
├── .env.example                  ← Environment variable reference
├── README.md                     ← This file
│
├── server/                       ← ✅ Node.js + Express Backend
│   ├── package.json
│   ├── server.js                 ← Entry point (Express app)
│   ├── .env.example              ← Server env vars template
│   │
│   ├── config/
│   │   └── db.js                 ← MongoDB connection (Mongoose)
│   │
│   ├── models/
│   │   └── User.js               ← User schema (name, email, password, careerPreference)
│   │
│   ├── controllers/
│   │   ├── authController.js     ← register() and login() logic
│   │   └── userController.js     ← getProfile() and updateProfile() logic
│   │
│   ├── routes/
│   │   ├── authRoutes.js         ← POST /api/auth/register, POST /api/auth/login
│   │   └── userRoutes.js         ← GET /api/user/profile, PUT /api/user/profile
│   │
│   └── middleware/
│       └── authMiddleware.js     ← JWT protect() middleware for private routes
│
└── client/                       ← ✅ React.js Frontend
    ├── package.json
    ├── public/
    │   └── index.html
    │
    └── src/
        ├── index.js              ← React entry point (imports Bootstrap)
        ├── index.css             ← Global custom styles
        ├── App.js                ← Router + ProtectedRoute wrapper
        │
        ├── context/
        │   └── AuthContext.js    ← Global auth state (user, token, login, logout)
        │
        ├── components/
        │   ├── Navbar.js         ← Responsive Bootstrap navbar
        │   └── Footer.js         ← Footer with links
        │
        └── pages/
            ├── Home.js           ← Hero, carousel, features, testimonials, CTA
            ├── Careers.js        ← After 10th & 12th career cards with search/filter
            ├── Register.js       ← Registration form with validation + API call
            ├── Login.js          ← Login form with JWT
            ├── Profile.js        ← Protected profile view + edit
            └── YouTube.js        ← Embedded YouTube career videos
```

---

## 🚀 Step-by-Step Setup & Run Guide

### ✅ Prerequisites – Install These First

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ (comes with Node) | – |
| MongoDB | v6+ (Community Edition) | https://www.mongodb.com/try/download/community |
| VS Code | Latest | https://code.visualstudio.com |
| Git | Any | https://git-scm.com |

> **Verify installations** by running in terminal:
> ```bash
> node --version    # Should show v18.x.x or higher
> npm --version     # Should show v9.x.x or higher
> mongod --version  # Should show v6.x.x or higher
> ```

---

### 📥 Step 1 – Get the Project into VS Code

**Option A – If you downloaded the ZIP:**
1. Extract the ZIP file
2. Open VS Code
3. Go to **File → Open Folder**
4. Select the `career-counselling` folder
5. Open the integrated terminal: **Terminal → New Terminal** (or Ctrl+`)

**Option B – If you cloned from Git:**
```bash
git clone <your-repo-url>
cd career-counselling
code .
```

---

### ⚙️ Step 2 – Configure Environment Variables

```bash
# In VS Code terminal, from the root folder:
cd server
copy .env.example .env        # Windows
# OR
cp .env.example .env          # Mac / Linux
```

Now **open `server/.env`** and set your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/career_counselling
JWT_SECRET=career_guide_super_secret_key_change_this_2024
JWT_EXPIRE=7d
```

> **Using MongoDB Atlas (Cloud)?** Replace MONGO_URI with your Atlas connection string.
> Format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/career_counselling`

---

### 🍃 Step 3 – Start MongoDB

**Windows:**
```bash
# Option 1: Start as Windows Service (if installed as service)
net start MongoDB

# Option 2: Run manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# Option 3: Use MongoDB Compass (GUI) – just open the app
```

**Mac:**
```bash
# If installed via Homebrew
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

**Linux (Ubuntu):**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod   # Auto-start on boot
```

> ✅ MongoDB is running when you see: `Waiting for connections on port 27017`

---

### 📦 Step 4 – Install All Dependencies

Open **THREE terminals** in VS Code (or run each in sequence):

**Terminal 1 – Install Root Dependencies:**
```bash
# Make sure you're in the career-counselling root folder
npm install
```

**Terminal 2 – Install Backend Dependencies:**
```bash
cd server
npm install
```

**Terminal 3 – Install Frontend Dependencies:**
```bash
cd client
npm install
```

> ⏳ This may take 2–5 minutes depending on your internet speed.

---

### ▶️ Step 5 – Run the Project

You need **two terminals** running simultaneously:

**Terminal A – Start the Backend Server:**
```bash
cd server
npm run dev
```
✅ You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

**Terminal B – Start the React Frontend:**
```bash
cd client
npm start
```
✅ You should see:
```
Compiled successfully!
Local: http://localhost:3000
```
> The browser will **automatically open** `http://localhost:3000`

---

### 🎯 Alternative: Run Both with One Command (from root)

```bash
# From the career-counselling root folder
npm start
```
This runs both frontend and backend **simultaneously** using `concurrently`.

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user, saves to MongoDB |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET`  | `/api/user/profile` | 🔒 Private | Get logged-in user's profile |
| `PUT`  | `/api/user/profile` | 🔒 Private | Update user profile data |

> 🔒 Private routes require `Authorization: Bearer <token>` header

---

## 🧪 Testing the Application

### Test Registration:
1. Open `http://localhost:3000/register`
2. Fill in Name, Email, Password, select After 10th or 12th
3. Click "Create Free Account"
4. You'll be redirected to your Profile page

### Test Login:
1. Open `http://localhost:3000/login`
2. Enter your registered email and password
3. Click "Sign In" – you'll see your profile

### Test Protected Route:
1. Without logging in, try visiting `http://localhost:3000/profile`
2. You'll be automatically redirected to `/login`

### Test API directly (using Postman or Thunder Client):
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "careerPreference": "after12th"
}
```

---

## 📱 Pages Overview

| Page | URL | Auth Required |
|------|-----|---------------|
| Home | `/` | No |
| Careers | `/careers` | No |
| YouTube Videos | `/youtube` | No |
| Register | `/register` | No |
| Login | `/login` | No |
| Profile | `/profile` | **Yes** |

---

## 🐛 Troubleshooting

### ❌ "MongoDB connection error"
- Make sure MongoDB is running (Step 3)
- Check your `MONGO_URI` in `server/.env`
- Try `mongodb://127.0.0.1:27017/career_counselling` instead of `localhost`

### ❌ "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### ❌ "npm install" fails
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### ❌ React not connecting to backend (CORS error)
- Ensure backend is running on port 5000
- Check `client/package.json` has `"proxy": "http://localhost:5000"`
- Restart both servers

### ❌ Login says "Invalid email or password" after registering
- Make sure you registered with the exact same email
- Check MongoDB is running and data was saved

---

## 🔧 VS Code Recommended Extensions

- **Thunder Client** – Test API endpoints directly in VS Code
- **MongoDB for VS Code** – View your database collections
- **ES7 React/Redux Snippets** – React code shortcuts
- **Prettier** – Code formatting
- **Auto Rename Tag** – HTML/JSX tag editing

---

## 📦 Technology Stack Summary

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.2.0 | UI Framework |
| React Router DOM | 6.x | Client-side routing |
| Bootstrap | 5.3.2 | CSS Framework & components |
| Bootstrap Icons | 1.11.3 | Icon library |
| Axios | 1.6.2 | HTTP requests to backend |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Express | 4.18.2 | Web server framework |
| Mongoose | 8.0.3 | MongoDB ODM |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| cors | 2.8.5 | Cross-Origin Resource Sharing |
| dotenv | 16.3.1 | Environment variables |
| nodemon | 3.0.2 | Auto-restart dev server |

---

## 🎨 Design Features
- ✅ Responsive design (mobile + desktop)
- ✅ Bootstrap 5 components (cards, carousel, navbar, badges, alerts)
- ✅ Custom CSS with CSS variables for consistent theming
- ✅ Google Fonts (Outfit) for modern typography
- ✅ Hover effects and smooth transitions
- ✅ Bootstrap Icons throughout
- ✅ Professional colour scheme (Navy Blue + Amber Gold)
- ✅ Password strength indicator
- ✅ Show/hide password toggle
- ✅ Loading spinners on all async operations
- ✅ Form validation (frontend + backend)

---

Made with ❤️ for Indian Students | CareerGuide © 2024
=======
# Career-counselling
career guidance for students after 10th and 12th
>>>>>>> 9374c9e6544b1583dfe262c5ce23fa279ee9aa52

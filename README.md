# Converso — Real-Time Chat & Video Calling Application

A modern, feature-rich chat application built with **Express.js** backend and **React** frontend, featuring real-time messaging, video calling via WebRTC, and intuitive UI/UX design.

## 🎯 Features

### Core Features
- **Real-Time Messaging** — Instant message delivery using Socket.io
- **Video & Audio Calling** — Peer-to-peer communication via WebRTC signaling
- **User Authentication** — Secure JWT-based authentication with bcrypt password hashing
- **File/Image Uploads** — Cloud storage integration via Cloudinary API
- **User Profiles** — Customizable profile pictures and user information
- **Online Status** — Real-time presence indicators
- **Conversation History** — Persistent message storage

### Technology Stack

**Frontend:**
- React 18+ with Vite for optimized bundling
- Socket.io client for real-time communication
- React hooks for state management
- CSS for responsive design
- React-Toastify for notifications

**Backend:**
- Express.js server with CORS support
- Socket.io for WebSocket communication
- MongoDB via Mongoose for data persistence
- JWT for authentication
- Cloudinary for image storage
- bcryptjs for password encryption

## 📁 Project Structure

```
ChatApp/
├── backend/
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── store.js               # Message persistence layer
│   │   ├── config/                # Configuration files
│   │   ├── middleware/            # Express middleware (auth, etc.)
│   │   ├── routes/                # API endpoints
│   │   ├── socket/                # Socket.io handlers
│   │   └── utils/                 # Helper functions (JWT, etc.)
│   ├── package.json
│   └── .env                       # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Full page components
│   │   ├── services/              # API & Socket.io services
│   │   ├── assets/                # Images, fonts, etc.
│   │   └── index.css              # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local                 # Frontend environment variables
│
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+) and npm
- MongoDB instance (local or cloud)
- Cloudinary account for image uploads

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables** (create `.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/converso
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

3. **Start the backend:**
   ```bash
   npm run dev     # Development with nodemon
   npm run start   # Production
   ```
   The server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables** (create `.env.local`):
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173`

## 🎨 UI/UX Best Practices Implemented

### 1. **User Interface Design**

#### Color Scheme & Accessibility
- **Dark Theme** — Reduces eye strain during extended use
- **High Contrast** — Text colors ensure readability
- **Consistent Palette** — Limited color set for visual coherence
- **WCAG Compliance** — Adequate color contrast ratios

#### Typography
- **Clear Hierarchy** — Different font sizes for headings, body, and labels
- **Readable Fonts** — Sans-serif fonts (system fonts) for better legibility
- **Appropriate Line Height** — 1.5x+ for comfort during reading
- **Max Line Length** — Text columns limited to ~60-80 characters

#### Spacing & Layout
- **Consistent Padding** — Uniform spacing for predictable layouts
- **Responsive Grid** — Flexible layouts for all screen sizes
- **White Space** — Strategic use of empty space to reduce cognitive load
- **Component Spacing** — Consistent gaps between interactive elements

### 2. **Interaction & Feedback**

#### Visual Feedback
- **Toast Notifications** — Non-intrusive success/error/info messages
- **Loading States** — Clear indicators for long-running operations
- **Hover Effects** — Interactive elements provide visual feedback
- **Button States** — Disabled, loading, and active states clearly visible

#### User Guidance
- **Placeholders** — Helpful hints in input fields
- **Error Messages** — Clear, actionable error explanations
- **Confirmation Dialogs** — Prevent unintended destructive actions
- **Status Indicators** — Online/offline presence badges

### 3. **Navigation**

#### Information Architecture
- **Clear Menu Structure** — Logical grouping of features
- **Breadcrumb Navigation** — Users always know their location
- **Consistent Navigation** — Menu placement and behavior consistent
- **Quick Access** — Frequently used features easily accessible

#### Mobile-First Design
- **Responsive Navigation** — Hamburger menus on mobile
- **Touch-Friendly Buttons** — Minimum 44x44px tap targets
- **Optimized for Mobile** — Stacked layouts on small screens
- **Readable on All Devices** — Font sizes scale appropriately

### 4. **Forms & Input**

#### User Input Design
- **Clear Labels** — Every input field has descriptive labels
- **Input Validation** — Real-time validation with helpful messages
- **Auto-Complete** — Saves user time when possible
- **Smart Defaults** — Pre-filled sensible values where appropriate

#### Form Usability
- **Logical Order** — Fields grouped by purpose
- **Single Column** — Easier to scan and faster form completion
- **Progress Indication** — Multi-step forms show progress
- **Clear CTAs** — Action buttons are prominent and labeled clearly

### 5. **Performance & Experience**

#### Speed Optimization
- **Lazy Loading** — Images and components load as needed
- **Asset Optimization** — Minified CSS/JS in production
- **Efficient Caching** — Browser and server-side caching
- **Code Splitting** — Vite optimizes bundles automatically

#### Real-Time Experience
- **Instant Messaging** — Socket.io for immediate feedback
- **Live Status Updates** — Real-time online indicators
- **Optimistic Updates** — UI updates before server confirmation
- **Connection Status** — Users see if they're disconnected

### 6. **Accessibility (a11y)**

#### Keyboard Navigation
- **Tab Navigation** — All interactive elements keyboard accessible
- **Focus Indicators** — Clear focus states for keyboard users
- **Keyboard Shortcuts** — Common shortcuts for power users
- **Escape Key** — Closes modals and dropdowns

#### Screen Reader Support
- **Semantic HTML** — Proper heading and landmark structure
- **ARIA Labels** — Descriptive labels for icon buttons
- **Alt Text** — Images have meaningful descriptions
- **Announcements** — Status messages announced to screen readers

### 7. **Mobile-First Approach**

- **Responsive Images** — Optimized for different screen sizes
- **Touch Gestures** — Swipe and tap actions clearly indicated
- **Mobile Optimization** — Touch targets larger on mobile
- **No Hover Dependencies** — Functionality doesn't depend solely on hover

## 📡 API Architecture

### Authentication
- JWT token-based authentication
- Secure password storage with bcryptjs
- Token refresh mechanism for security

### Real-Time Communication
- Socket.io for instant messaging
- Event-driven architecture
- Message broadcasting to relevant users

### Data Persistence
- MongoDB for storing users, messages, conversations
- Structured schemas with Mongoose ODM
- Efficient queries and indexing

## 🔐 Security Best Practices

### Frontend Security
- XSS protection through React's automatic escaping
- CORS-enabled requests to backend only
- Secure token storage in localStorage
- Environment variables for sensitive data

### Backend Security
- Input validation and sanitization
- Rate limiting to prevent abuse
- Secure password hashing (bcrypt)
- JWT signature verification
- CORS whitelist configuration

## 🌐 Environment Variables

### Backend (.env)
```env
PORT = Server port (default: 5000)
MONGODB_URI = MongoDB connection string
JWT_SECRET = Secret key for JWT signing
CLOUDINARY_NAME = Cloudinary account name
CLOUDINARY_API_KEY = Cloudinary API key
CLOUDINARY_API_SECRET = Cloudinary API secret
NODE_ENV = Environment type (development/production)
```

### Frontend (.env.local)
```env
VITE_API_URL = Backend API URL
VITE_SOCKET_URL = WebSocket server URL
```

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```
Output in `frontend/dist/` ready for static hosting.

### Backend Deployment
```bash
cd backend
npm run start
```
Set `NODE_ENV=production` for optimized performance.

## 🤝 Contributing

When developing new features:
1. Follow the established UI/UX design patterns
2. Ensure responsive design across devices
3. Add proper error handling and user feedback
4. Test accessibility with keyboard navigation
5. Maintain consistent code style and structure

## 📝 Common Development Tasks

### Add a New Component
1. Create component in `frontend/src/components/`
2. Import and use in parent component
3. Apply global styles for consistency

### Add a New API Route
1. Create route file in `backend/src/routes/`
2. Add authentication middleware if needed
3. Document endpoint in API documentation

### Add Real-Time Feature
1. Emit socket event from frontend
2. Add listener in `backend/src/socket/`
3. Broadcast updates back to clients

## 🐛 Troubleshooting

### Messages Not Syncing
- Check WebSocket connection status
- Verify Socket.io server running on backend
- Check browser console for errors

### Profile Pictures Not Showing
- Verify Cloudinary credentials in `.env`
- Check network tab for failed uploads
- Ensure user has proper permissions

### Authentication Errors
- Verify JWT_SECRET is set in backend
- Check token isn't expired
- Clear localStorage and re-login

## 📖 Documentation

- **Frontend Components** — See component files for prop documentation
- **Backend Routes** — See route files for endpoint details
- **Socket Events** — See `backend/src/socket/` for event documentation

## 📄 License

ISC

## 👤 Author

Converso Team

---

**Built with ❤️ for real-time communication**

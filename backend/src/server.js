require("dotenv").config();

const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const fileUpload = require("express-fileupload");

const connectDB   = require("./config/db");
const authRoutes  = require("./routes/auth");
const userRoutes  = require("./routes/users");
const uploadRoutes = require("./routes/upload");
const initSocket  = require("./socket");

const app    = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();


/* ─── CORS ─── */
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
  origin:      CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true,
}));

/* ─── REST API ─── */
app.get("/",           (_req, res) => res.json({ status: "ok", app: "Converso API", version: "1.0.0" }));
app.get("/health",     (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));
app.use("/api/auth",   authRoutes);
app.use("/api/users",  userRoutes);
app.use("/api/upload", uploadRoutes);

/* 404 handler */
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

/* Error handler */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

/* ─── Socket.io ─── */
const io = new Server(server, {
  cors: {
    origin:      CLIENT_URL,
    credentials: true,
    methods:     ["GET", "POST"],
  },
  pingTimeout:  60000,
  pingInterval: 25000,
});

initSocket(io);

/* ─── Start ─── */
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`\n✅  Converso API running at http://localhost:${PORT}`);
  console.log(`🔌  Socket.io ready`);
  console.log(`🌐  Accepting connections from ${CLIENT_URL}\n`);
});

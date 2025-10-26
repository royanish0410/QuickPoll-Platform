
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./models/db";
import pollRoutes from "./routes/polls";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO setup
const io = new Server(server, {
  cors: { 
    origin: process.env.CORS_ORIGIN || "*", 
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Attach io to app so routes can access it
app.set("io", io);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Join a specific poll room
  socket.on("join:poll", (pollId: string) => {
    socket.join(`poll:${pollId}`);
    console.log(`User ${socket.id} joined poll ${pollId}`);
  });

  // Leave a poll room
  socket.on("leave:poll", (pollId: string) => {
    socket.leave(`poll:${pollId}`);
    console.log(`User ${socket.id} left poll ${pollId}`);
  });

  // Request all polls
  socket.on("request:polls", () => {
    console.log(`User ${socket.id} requested polls`);
    // This will be handled by the client listening to 'polls:list'
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "QuickPoll API Server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      polls: "/api/polls",
      health: "/api/health"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: "connected",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/polls", pollRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Error:", err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Then start the server
    server.listen(PORT, () => {
      console.log(`🚀 QuickPoll server running on http://localhost:${PORT}`);
      console.log(`📡 Socket.IO ready for real-time connections`);
      console.log(`🗄️  MongoDB connected`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { app, server, io };
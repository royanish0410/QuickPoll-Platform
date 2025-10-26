import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./models/db";
import pollRoutes from "./routes/polls";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Attach io to app so routes can access it
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (room) => socket.join(room));

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// Routes
app.use("/api/polls", pollRoutes);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

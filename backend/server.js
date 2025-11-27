// imports
import express from "express";
import cors from "cors";

// express app
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// Import routes AFTER environment variables are loaded
import cp from "./routes/conversation_participants.js";
app.use(cp);

// root endpoint - verify server status
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to lineUp API server! 🎶",
    version: "0.0.1",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

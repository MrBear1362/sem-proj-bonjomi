// imports
import express from "express";
import cors from "cors";

// express app
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

//routes
import notesRoutes from "./routes/notes.js";
app.use(notesRoutes);

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

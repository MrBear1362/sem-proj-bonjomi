// imports
import express from "express";
import cors from "cors";
import collab_requests from "./routes/collab_requests.js";
import user_profiles from "./routes/user_profiles.js";

// express app
const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());
// routes
app.use(
  collab_requests,
  user_profiles
);

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

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
// Import routes AFTER environment variables are loaded
import collab_requestsRoutes from "./routes/collab_requests.js";
import user_profilesRoutes from "./routes/user_profiles.js";
import notesRoutes from "./routes/notes.js";
import servicesRoutes from "./routes/services.js";
import businessesRoutes from "./routes/businesses.js";
import onboardingRoutes from "./routes/onboarding.js";
app.use(
	collab_requestsRoutes,
	user_profilesRoutes,
	notesRoutes,
	servicesRoutes,
	businessesRoutes,
	onboardingRoutes
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

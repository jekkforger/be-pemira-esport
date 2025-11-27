import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import votingRoutes from "./routes/voting.js";
import candidateRoutes from "./routes/candidates.js";
import voterRoutes from "./routes/voters.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voters", voterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

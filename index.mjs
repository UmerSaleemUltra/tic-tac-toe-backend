import express from "express";
import cors from "cors";
import db from "./Config/db.js";
import router from "./routes/roomroutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Database connection
db.connection.once("open", () => {
  console.log("Database connected successfully!");
});

// Listen on a dynamic port for Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export for Vercel
export default app;

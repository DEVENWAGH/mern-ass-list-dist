const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure CORS properly
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://mern-ass.vercel.app",
  "https://mern-ass-deven-waghs-projects.vercel.app/",
  // Add any other Vercel preview URLs if needed
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS: ", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/health", require("./routes/health"));
app.use("/api/csv", require("./routes/csvRoutes"));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
} else {
  app.get("/", (req, res) => res.send("API is running in development mode"));
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

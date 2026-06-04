const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");
const seedDatabase = require("./seed/seedDatabase");
const customerRoutes = require("./routes/customer.routes");
const accountRoutes = require("./routes/account.routes");

const app = express();

let initPromise = null;

async function ensureDatabase(req, res, next) {
  try {
    if (!initPromise) {
      initPromise = connectDatabase().then(() => seedDatabase());
    }
    await initPromise;
    next();
  } catch (error) {
    console.error("Database init failed:", error.message);
    res.status(500).json({
      message: "Database connection failed",
      detail: error.message,
    });
  }
}

app.use(ensureDatabase);

const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim());

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  if (origin.endsWith(".vercel.app")) {
    return true;
  }
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
  })
);
app.use(express.json());
app.use("/api/customers", customerRoutes);
app.use("/api/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Banking REST API is running.",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;

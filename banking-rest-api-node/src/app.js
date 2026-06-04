const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customer.routes");
const accountRoutes = require("./routes/account.routes");

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
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

module.exports = app;

const express = require("express");
const customerRoutes = require("./routes/customer.routes");
const accountRoutes = require("./routes/account.routes");

const app = express();

app.use(express.json());
app.use("/api/customers", customerRoutes);
app.use("/api/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Banking REST API starter is running.",
  });
});

module.exports = app;

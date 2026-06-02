const Customer = require("../models/customer.model");
const { accounts } = require("./account.data");

const customers = [
  new Customer({
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
  }),
  new Customer({
    id: 2,
    name: "Brian Lee",
    email: "brian.lee@example.com",
  }),
  new Customer({
    id: 3,
    name: "Carla Davis",
    email: "carla.davis@example.com",
  }),
];

// Attach each customer's accounts from the global list (single source of truth).
customers.forEach((customer) => {
  customer.accounts = accounts.filter(
    (account) => account.customerId === customer.id
  );
});

module.exports = {
  customers,
};

const SEED_CUSTOMERS = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
  { id: 2, name: "Brian Lee", email: "brian.lee@example.com" },
  { id: 3, name: "Carla Davis", email: "carla.davis@example.com" },
];

const SEED_ACCOUNTS = [
  {
    id: 101,
    customerId: 1,
    accountNumber: "CHK-1001",
    accountType: "Checking",
    balance: 4200,
  },
  {
    id: 102,
    customerId: 1,
    accountNumber: "SAV-1001",
    accountType: "Savings",
    balance: 6900,
  },
  {
    id: 201,
    customerId: 2,
    accountNumber: "CHK-1002",
    accountType: "Checking",
    balance: 1800,
  },
  {
    id: 202,
    customerId: 2,
    accountNumber: "SAV-1002",
    accountType: "Savings",
    balance: 3400,
  },
  {
    id: 301,
    customerId: 3,
    accountNumber: "CHK-1003",
    accountType: "Checking",
    balance: 5600,
  },
  {
    id: 302,
    customerId: 3,
    accountNumber: "SAV-1003",
    accountType: "Savings",
    balance: 7300,
  },
];

module.exports = {
  SEED_CUSTOMERS,
  SEED_ACCOUNTS,
};

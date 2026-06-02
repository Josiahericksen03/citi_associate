const Customer = require("../../src/models/customer.model");
const Account = require("../../src/models/account.model");
const { customers } = require("../../src/data/customer.data");
const { accounts } = require("../../src/data/account.data");

const SEED_ACCOUNT_ROWS = [
  { id: 101, customerId: 1, accountNumber: "CHK-1001", accountType: "Checking", balance: 4200 },
  { id: 102, customerId: 1, accountNumber: "SAV-1001", accountType: "Savings", balance: 6900 },
  { id: 201, customerId: 2, accountNumber: "CHK-1002", accountType: "Checking", balance: 1800 },
  { id: 202, customerId: 2, accountNumber: "SAV-1002", accountType: "Savings", balance: 3400 },
  { id: 301, customerId: 3, accountNumber: "CHK-1003", accountType: "Checking", balance: 5600 },
  { id: 302, customerId: 3, accountNumber: "SAV-1003", accountType: "Savings", balance: 7300 },
];

const SEED_CUSTOMER_ROWS = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
  { id: 2, name: "Brian Lee", email: "brian.lee@example.com" },
  { id: 3, name: "Carla Davis", email: "carla.davis@example.com" },
];

function resetData() {
  accounts.length = 0;
  customers.length = 0;

  SEED_ACCOUNT_ROWS.forEach((row) => {
    accounts.push(new Account(row));
  });

  SEED_CUSTOMER_ROWS.forEach((row) => {
    customers.push(new Customer({ ...row, accounts: [] }));
  });

  customers.forEach((customer) => {
    customer.accounts = accounts.filter(
      (account) => account.customerId === customer.id
    );
  });
}

module.exports = {
  resetData,
  SEED_ACCOUNT_ROWS,
  SEED_CUSTOMER_ROWS,
};

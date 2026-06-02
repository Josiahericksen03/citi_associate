const Account = require("../models/account.model");

const accounts = [
  new Account({
    id: 101,
    customerId: 1,
    accountNumber: "CHK-1001",
    accountType: "Checking",
    balance: 4200,
  }),
  new Account({
    id: 102,
    customerId: 1,
    accountNumber: "SAV-1001",
    accountType: "Savings",
    balance: 6900,
  }),
  new Account({
    id: 201,
    customerId: 2,
    accountNumber: "CHK-1002",
    accountType: "Checking",
    balance: 1800,
  }),
  new Account({
    id: 202,
    customerId: 2,
    accountNumber: "SAV-1002",
    accountType: "Savings",
    balance: 3400,
  }),
  new Account({
    id: 301,
    customerId: 3,
    accountNumber: "CHK-1003",
    accountType: "Checking",
    balance: 5600,
  }),
  new Account({
    id: 302,
    customerId: 3,
    accountNumber: "SAV-1003",
    accountType: "Savings",
    balance: 7300,
  }),
];

module.exports = {
  accounts,
};

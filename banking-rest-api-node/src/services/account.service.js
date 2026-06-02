const { accounts } = require("../data/account.data");
const { customers } = require("../data/customer.data");
const Account = require("../models/account.model");

function getAllAccounts() {
  return accounts;
}

function getAccountById(id) {
  return accounts.find((account => account.id === Number(id)));
}

function getAccountByName(name) {
  const matchingCustomerIds = customers
    .filter((customer) =>
      customer.name.toLowerCase().includes(name.toLowerCase())
    )
    .map((customer) => customer.id);

  return accounts.filter((account) =>
    matchingCustomerIds.includes(account.customerId)
  );
}

function createAccount(accountData) {
  const customer = customers.find(
    (c) => c.id === Number(accountData.customerId)
  );
  if (!customer) {
    return null;
  }

  const nextId =
    accounts.length > 0
      ? Math.max(...accounts.map((account) => account.id)) + 1
      : 1;

  const account = new Account({
    id: nextId,
    customerId: Number(accountData.customerId),
    accountNumber: accountData.accountNumber,
    accountType: accountData.accountType,
    balance: accountData.balance,
  });

  accounts.push(account);
  customer.accounts.push(account);
  return account;
}

function updateAccount(id, accountData) {
  const account = getAccountById(id);
  if (!account) {
    return null;
  }

  account.accountType = accountData.accountType;
  account.balance = accountData.balance;
  return account;
}

function deleteAccount(id) {
  const numericId = Number(id);
  const index = accounts.findIndex((a) => a.id === numericId);
  if (index === -1) {
    return null;
  }

  const [deletedAccount] = accounts.splice(index, 1);

  const customer = customers.find((c) => c.id === deletedAccount.customerId);
  if (customer) {
    const customerAccountIndex = customer.accounts.findIndex(
      (a) => a.id === numericId
    );
    if (customerAccountIndex !== -1) {
      customer.accounts.splice(customerAccountIndex, 1);
    }
  }

  return deletedAccount;
}

module.exports = {
  getAllAccounts,
  getAccountById,
  getAccountByName,
  createAccount,
  updateAccount,
  deleteAccount,
};

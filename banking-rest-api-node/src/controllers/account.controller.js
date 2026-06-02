const accountService = require("../services/account.service");

function getAllAccounts(req, res) {
  const accounts = accountService.getAllAccounts();
  return res.status(200).json(accounts);
}

function getAccountById(req, res) {
  const { id } = req.params;
  const account = accountService.getAccountById(id);
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  return res.status(200).json(account);
}

function getAccountByName(req, res) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Name query parameter is required" });
  }

  const accounts = accountService.getAccountByName(name);
  return res.status(200).json(accounts);
}

function createAccount(req, res) {
  const { customerId, accountNumber, accountType, balance } = req.body;
  if (
    !customerId ||
    !accountNumber ||
    !accountType ||
    balance === undefined ||
    balance === null
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const account = accountService.createAccount({
    customerId,
    accountNumber,
    accountType,
    balance,
  });
  if (!account) {
    return res.status(404).json({ message: "Customer not found" });
  }
  return res.status(201).json(account);
}

function updateAccount(req, res) {
  const { id } = req.params;
  const { accountType, balance } = req.body;
  if (!accountType || balance === undefined || balance === null) {
    return res.status(400).json({ message: "accountType and balance are required" });
  }
  const account = accountService.updateAccount(id, { accountType, balance });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  return res.status(200).json(account);
}

function deleteAccount(req, res) {
  const { id } = req.params;
  const account = accountService.deleteAccount(id);
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  return res.status(200).json(account);
}

module.exports = {
  getAllAccounts,
  getAccountById,
  getAccountByName,
  createAccount,
  updateAccount,
  deleteAccount,
};

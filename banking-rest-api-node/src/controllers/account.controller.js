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

module.exports = {
  getAllAccounts,
  getAccountById,
  getAccountByName,
};

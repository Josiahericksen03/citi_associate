const accountService = require("../services/account.service");

async function getAllAccounts(req, res) {
  try {
    const accounts = await accountService.getAllAccounts();
    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAccountById(req, res) {
  try {
    const { id } = req.params;
    const account = await accountService.getAccountById(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAccountByName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Name query parameter is required" });
    }

    const accounts = await accountService.getAccountByName(name);
    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createAccount(req, res) {
  try {
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

    const account = await accountService.createAccount({
      customerId,
      accountNumber,
      accountType,
      balance,
    });
    if (!account) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(201).json(account);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateAccount(req, res) {
  try {
    const { id } = req.params;
    const { accountType, balance } = req.body;
    if (!accountType || balance === undefined || balance === null) {
      return res.status(400).json({ message: "accountType and balance are required" });
    }
    const account = await accountService.updateAccount(id, { accountType, balance });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteAccount(req, res) {
  try {
    const { id } = req.params;
    const account = await accountService.deleteAccount(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllAccounts,
  getAccountById,
  getAccountByName,
  createAccount,
  updateAccount,
  deleteAccount,
};

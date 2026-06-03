const Account = require("../models/account.model");
const Customer = require("../models/customer.model");
const { getNextId } = require("../utils/idHelper");

async function getAllAccounts() {
  return Account.find().lean();
}

async function getAccountById(id) {
  return Account.findOne({ id: Number(id) }).lean();
}

async function getAccountByName(name) {
  const matchingCustomers = await Customer.find({
    name: { $regex: name, $options: "i" },
  })
    .select("id")
    .lean();

  const customerIds = matchingCustomers.map((customer) => customer.id);

  return Account.find({ customerId: { $in: customerIds } }).lean();
}

async function createAccount(accountData) {
  const customer = await Customer.findOne({
    id: Number(accountData.customerId),
  }).lean();

  if (!customer) {
    return null;
  }

  const nextId = await getNextId(Account);

  const account = await Account.create({
    id: nextId,
    customerId: Number(accountData.customerId),
    accountNumber: accountData.accountNumber,
    accountType: accountData.accountType,
    balance: accountData.balance,
  });

  return account.toObject();
}

async function updateAccount(id, accountData) {
  const account = await Account.findOneAndUpdate(
    { id: Number(id) },
    {
      accountType: accountData.accountType,
      balance: accountData.balance,
    },
    { new: true }
  ).lean();

  return account;
}

async function deleteAccount(id) {
  return Account.findOneAndDelete({ id: Number(id) }).lean();
}

module.exports = {
  getAllAccounts,
  getAccountById,
  getAccountByName,
  createAccount,
  updateAccount,
  deleteAccount,
};

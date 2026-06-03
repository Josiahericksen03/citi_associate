const Customer = require("../models/customer.model");
const { getNextId } = require("../utils/idHelper");
const {
  attachAccountsToCustomer,
  attachAccountsToCustomers,
} = require("../utils/customerHelpers");

async function removeAccountsByCustomerId(customerId) {
  const Account = require("../models/account.model");
  await Account.deleteMany({ customerId });
}

async function getAllCustomers() {
  const customers = await Customer.find().lean();
  return attachAccountsToCustomers(customers);
}

async function getCustomerById(id) {
  const customer = await Customer.findOne({ id: Number(id) }).lean();
  if (!customer) {
    return null;
  }
  return attachAccountsToCustomer(customer);
}

async function getCustomerByName(name) {
  const customers = await Customer.find({
    name: { $regex: name, $options: "i" },
  }).lean();
  return attachAccountsToCustomers(customers);
}

async function getAllPremiumCustomers() {
  const PREMIUM_THRESHOLD = 10000;
  const customers = await getAllCustomers();

  return customers.filter((customer) => {
    const totalBalance = customer.accounts.reduce(
      (sum, account) => sum + Number(account.balance || 0),
      0
    );
    return totalBalance > PREMIUM_THRESHOLD;
  });
}

async function createCustomer(customerData) {
  const nextId = await getNextId(Customer);

  const customer = await Customer.create({
    id: nextId,
    name: customerData.name,
    email: customerData.email,
  });

  return {
    ...customer.toObject(),
    accounts: [],
  };
}

async function updateCustomer(id, customerData) {
  const customer = await Customer.findOneAndUpdate(
    { id: Number(id) },
    { name: customerData.name, email: customerData.email },
    { new: true }
  ).lean();

  if (!customer) {
    return null;
  }

  return attachAccountsToCustomer(customer);
}

async function deleteCustomer(id) {
  const numericId = Number(id);
  const customer = await Customer.findOneAndDelete({ id: numericId }).lean();

  if (!customer) {
    return null;
  }

  await removeAccountsByCustomerId(numericId);

  return {
    ...customer,
    accounts: [],
  };
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByName,
  getAllPremiumCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

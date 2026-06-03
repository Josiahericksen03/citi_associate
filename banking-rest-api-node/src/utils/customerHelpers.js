const Account = require("../models/account.model");

async function getAccountsForCustomer(customerId) {
  return Account.find({ customerId }).lean();
}

async function attachAccountsToCustomer(customer) {
  const accounts = await getAccountsForCustomer(customer.id);
  return {
    ...customer,
    accounts,
  };
}

async function attachAccountsToCustomers(customers) {
  return Promise.all(customers.map((customer) => attachAccountsToCustomer(customer)));
}

module.exports = {
  getAccountsForCustomer,
  attachAccountsToCustomer,
  attachAccountsToCustomers,
};

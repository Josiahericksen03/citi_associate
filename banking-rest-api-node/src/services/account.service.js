const { accounts } = require("../data/account.data");
const { customers } = require("../data/customer.data");

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

module.exports = {
  getAllAccounts,
  getAccountById,
  getAccountByName,
};

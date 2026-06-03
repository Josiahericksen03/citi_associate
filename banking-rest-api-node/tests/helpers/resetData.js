const Customer = require("../../src/models/customer.model");
const Account = require("../../src/models/account.model");
const { SEED_CUSTOMERS, SEED_ACCOUNTS } = require("../../src/seed/seedData");

async function resetData() {
  await Account.deleteMany({});
  await Customer.deleteMany({});
  await Customer.insertMany(SEED_CUSTOMERS);
  await Account.insertMany(SEED_ACCOUNTS);
}

module.exports = {
  resetData,
  SEED_CUSTOMERS,
  SEED_ACCOUNTS,
};

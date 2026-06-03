const Customer = require("../models/customer.model");
const Account = require("../models/account.model");
const { SEED_CUSTOMERS, SEED_ACCOUNTS } = require("./seedData");

async function seedDatabase() {
  const customerCount = await Customer.countDocuments();

  if (customerCount > 0) {
    return;
  }

  await Customer.insertMany(SEED_CUSTOMERS);
  await Account.insertMany(SEED_ACCOUNTS);
  console.log("Database seeded with default customers and accounts");
}

module.exports = seedDatabase;

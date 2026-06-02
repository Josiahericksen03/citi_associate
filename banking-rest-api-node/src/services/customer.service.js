const { customers } = require("../data/customer.data");
const Customer = require("../models/customer.model");



function getAllCustomers() {
  return customers;
}

function getCustomerById(id) {
  return customers.find((customer => customer.id === Number(id)));
}

function getCustomerByName(name) {
  return customers.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
}

function getAllPremiumCustomers() {
  const PREMIUM_THRESHOLD = 10000;

  return customers.filter((customer) => {
    const totalBalance = customer.accounts.reduce(
      (sum, account) => sum + Number(account.balance || 0),
      0
    );
    return totalBalance > PREMIUM_THRESHOLD;
  });
}

function createCustomer(customerData) {
  const nextId =
    customers.length > 0
      ? Math.max(...customers.map((customer) => customer.id)) + 1
      : 1;

  const customer = new Customer({
    id: nextId,
    name: customerData.name,
    email: customerData.email,
    accounts: [],
  });

  customers.push(customer);
  return customer;
}

function updateCustomer(id, customerData) {
  const customer = getCustomerById(id);
  if (!customer) {
    return null;
  }

  customer.name = customerData.name;
  customer.email = customerData.email;
  return customer;
}

function deleteCustomer(id) {
  const numericId = Number(id);
  //turn id into number, find customer id in list
  const index = customers.findIndex((c) => c.id === numericId);
  if (index === -1) {
    return null;
  }
  //remove customer from list, then clear accounts, return deleted customer
  const [deletedCustomer] = customers.splice(index, 1);
  deletedCustomer.accounts = [];
  return deletedCustomer;
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

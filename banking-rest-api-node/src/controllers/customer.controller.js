const customerService = require("../services/customer.service");


function getAllCustomers(req, res) {
  const customers = customerService.getAllCustomers();
  return res.status(200).json(customers);
}

function getCustomerById(req, res) {
  const { id } = req.params;
  const customer = customerService.getCustomerById(id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  return res.status(200).json(customer);
}

function getCustomerByName(req, res) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Name query parameter is required" });
  }

  const customer = customerService.getCustomerByName(name);
  return res.status(200).json(customer);
}

function getAllPremiumCustomers(req, res) {
  const customers = customerService.getAllPremiumCustomers();
  return res.status(200).json(customers);
}

function createCustomer(req, res) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const customer = customerService.createCustomer({ name, email });
  return res.status(201).json(customer);
}

function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const customer = customerService.updateCustomer(id, { name, email });
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  return res.status(200).json(customer);
}

function deleteCustomer(req, res) {
  const { id } = req.params;
  const customer = customerService.deleteCustomer(id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  return res.status(200).json(customer);
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

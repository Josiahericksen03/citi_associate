const customerService = require("../services/customer.service");

async function getAllCustomers(req, res) {
  try {
    const customers = await customerService.getAllCustomers();
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getCustomerByName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Name query parameter is required" });
    }

    const customers = await customerService.getCustomerByName(name);
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllPremiumCustomers(req, res) {
  try {
    const customers = await customerService.getAllPremiumCustomers();
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createCustomer(req, res) {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const customer = await customerService.createCustomer({ name, email });
    return res.status(201).json(customer);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const customer = await customerService.updateCustomer(id, { name, email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    const customer = await customerService.deleteCustomer(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
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

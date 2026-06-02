const express = require("express");
const customerController = require("../controllers/customer.controller");

const router = express.Router();

router.get("/", customerController.getAllCustomers);

router.get("/search", customerController.getCustomerByName);

router.get("/premium", customerController.getAllPremiumCustomers);

router.post("/", customerController.createCustomer);

router.put("/:id", customerController.updateCustomer);

router.get("/:id", customerController.getCustomerById);

router.delete("/:id", customerController.deleteCustomer);

module.exports = router;

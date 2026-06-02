const express = require("express");
const accountController = require("../controllers/account.controller");

const router = express.Router();

router.get("/", accountController.getAllAccounts);
router.get("/search", accountController.getAccountByName);
router.get("/:id", accountController.getAccountById);

module.exports = router;

const express = require("express");
const accountController = require("../controllers/account.controller");

const router = express.Router();

router.get("/", accountController.getAllAccounts);
router.get("/search", accountController.getAccountByName);
router.get("/:id", accountController.getAccountById);
router.post("/", accountController.createAccount);
router.put("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

module.exports = router;

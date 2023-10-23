const express = require("express");
const router = express.Router();
const { createAccount, getAllAccounts, getAccountDetail } = require("../controllers/accounts.controller");

router.post("/", createAccount);
router.get("/", getAllAccounts);
router.get("/:id", getAccountDetail);

module.exports = router;

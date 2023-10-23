const express = require("express");
const router = express.Router();
const { createTransaction, getAllTransactions, getTransactionDetail } = require("../controllers/transactions.controller");

router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.get("/:id", getTransactionDetail);

module.exports = router;

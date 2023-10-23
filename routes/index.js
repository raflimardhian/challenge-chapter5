const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const User = require("./users.routes");
const Account = require("./accounts.routes");
const Transaction = require("./transactions.routes");
const Dashboard = require("./dashboard.routes");
const file = fs.readFileSync("docs/swagger.yaml", "utf8");

// api docs
const swaggerDocument = YAML.parse(file);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API
router.use("/api/v1/users", User);
router.use("/api/v1/accounts", Account);
router.use("/api/v1/transactions", Transaction);

// Dashboard
router.use("/", Dashboard);

module.exports = router;

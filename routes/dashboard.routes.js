const router = require("express").Router();
const { dashboardUser, getLoginUser, createLoginUser, getRegisterUser, createRegisterUser, getLogoutUser } = require("../controllers/users.controller");

// Users Data
router.get("/", dashboardUser);
router.get("/login", getLoginUser);
router.post("/login", createLoginUser);
router.get("/register", getRegisterUser);
router.post("/register", createRegisterUser);
router.get("/logout", getLogoutUser);

module.exports = router;

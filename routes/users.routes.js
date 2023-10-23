const router = require("express").Router();
const { createUser, getAllUsers, getUserDetail, registerUser, loginUser, authenticateUser } = require("../controllers/users.controller");
const Auth = require("../middlewares/authentication");

// Users Data
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserDetail);
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/authenticate", Auth, authenticateUser);

module.exports = router;

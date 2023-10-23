const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  // Create User
  createUser: async (req, res, next) => {
    try {
      let { name, email, password, identity_type, identity_number, address } = req.body;

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
          data: null,
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      let newUser = await prisma.users.create({
        data: {
          name,
          email,
          password: encryptedPassword,
        },
      });

      let newProfile = await prisma.profiles.create({
        data: {
          userId: newUser.id,
          identity_type,
          identity_number,
          address,
        },
      });

      res.status(201).json({
        status: true,
        message: "User and Profile Created Successfully",
        data: { newUser, newProfile },
      });
    } catch (err) {
      next(err);
    }
  },

  // Get All Users
  getAllUsers: async (req, res, next) => {
    try {
      let { limit = 5, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      let users = await prisma.users.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      const { _count } = await prisma.users.aggregate({
        _count: { id: true },
      });

      let pagination = getPagination(req, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "Get All Users Successfully",
        data: { pagination, users },
      });
    } catch (err) {
      next(err);
    }
  },

  // Get User Detail
  getUserDetail: async (req, res, next) => {
    try {
      let id = req.params.id;

      const user = await prisma.users.findUnique({
        where: { id: Number(id) },
        include: {
          profile: true,
        },
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
          data: `No user found with ID ${id}`,
        });
      }

      res.status(200).json({
        status: true,
        message: "Get User Detail Successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  // Register User
  registerUser: async (req, res, next) => {
    try {
      let { name, email, password, password_confirmation } = req.body;

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
          data: null,
        });
      }

      if (password != password_confirmation) {
        return res.status(400).json({
          status: false,
          message: "please ensure that the password and password confirmation match!",
          data: null,
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      let newUser = await prisma.users.create({
        data: {
          name,
          email,
          password: encryptedPassword,
        },
      });

      res.status(201).json({
        status: true,
        message: "User and Profile Created Successfully",
        data: { newUser },
      });
    } catch (err) {
      next(err);
    }
  },

  // Login User
  loginUser: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "invalid email or password!",
          data: null,
        });
      }

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: "invalid email or password!",
          data: null,
        });
      }

      let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

      return res.status(200).json({
        status: true,
        message: "OK",
        data: { user, token },
      });
    } catch (err) {
      next(err);
    }
  },

  authenticateUser: (req, res, next) => {
    try {
      return res.status(200).json({
        status: true,
        message: "OK",
        data: { user: req.user },
      });
    } catch (err) {
      next(err);
    }
  },

  getLoginUser: (req, res, next) => {
    try {
      res.render("login", { msg1: req.flash("msg1"), msg2: req.flash("msg2"), msg3: req.flash("msg3") });
    } catch (err) {
      next(err);
    }
  },

  getRegisterUser: (req, res, next) => {
    try {
      res.render("register", { msg1: req.flash("msg1"), msg2: req.flash("msg2"), msg3: req.flash("msg3") });
    } catch (err) {
      next(err);
    }
  },

  createRegisterUser: async (req, res, next) => {
    try {
      let { name, email, password, password_confirmation } = req.body;

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        req.flash("msg1", "Email already exists");
        res.redirect("/register");
      }

      if (password != password_confirmation) {
        req.flash("msg2", "please ensure that the password and password confirmation match!");
        res.redirect("/register");
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      await prisma.users.create({
        data: {
          name,
          email,
          password: encryptedPassword,
        },
      });

      req.flash("msg3", "Register Successfully");
      res.redirect("/login");
    } catch (err) {
      next(err);
    }
  },

  createLoginUser: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        req.flash("msg1", "Invalid Email or Password!");
        res.redirect("/login");
      }

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        req.flash("msg2", "invalid email or password!");
        res.redirect("/login");
      }

      let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

      res.cookie("token", token);
      res.redirect("/");
      req.flash("msg3", "Login Successfully");
    } catch (err) {
      next(err);
    }
  },

  dashboardUser: async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.redirect("/login");
      }

      const response = await axios.get("http://localhost:3000/api/v1/users/auth/authenticate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      res.render("dashboard-user", { user: response.data });
    } catch (err) {
      next(err);
    }
  },

  getLogoutUser: (req, res, next) => {
    try {
      res.clearCookie("token");
      res.redirect("/login");
    } catch (err) {
      next(err);
    }
  },
};

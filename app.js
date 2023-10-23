require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const router = require("./routes");
const { SESSION_SECRET_KEY } = process.env;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "controllers")));
app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(router);

// 404 error handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
  });
});

// 500 error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    status: false,
    message: "Internal Server Error",
    data: null,
  });
});

module.exports = app;

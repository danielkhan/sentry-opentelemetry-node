const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Sentry = require('@sentry/node-experimental');

Sentry.init({
  dsn: process.env.SENTRY_FRONTEND_DSN,
  tracesSampleRate: 1.0,
});

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();
app.locals.sentryBrowserDSN = process.env.SENTRY_BROWSER_DSN;

const indexRouter = require("./routes/index");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter());

app.use(Sentry.Handlers.errorHandler());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

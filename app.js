const express = require("express");

// app.js

// require("dotenv").config();

// console.log(process.env.NODE_ENV); // production

const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");

const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

const cors = require("cors");

app.use(cors());

const { createUser, loginUser } = require("./controllers/users");

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes/index");

app.use(express.json());

app.post("/signin", loginUser);
app.post("/signup", createUser);

app.use(requestLogger);

app.use(routes);

app.use(errorLogger); // enabling the error logger

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});

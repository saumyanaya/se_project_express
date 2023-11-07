const express = require("express");

const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");

const app = express();

const cors = require("cors");

app.use(cors());

const { createUser, loginUser } = require("./controllers/users");

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes/index");

app.use(express.json());

app.post("/signin", loginUser);
app.post("/signup", createUser);

app.use(routes);

app.listen(PORT, () => {});

const express = require("express");
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const { createUser, loginUser } = require("./controllers/users");
const app = express();

//app.js
const cors = require("cors");

app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => console.log("db error", e),
);

const routes = require("./routes/index");

app.use(express.json());

app.post("/signin", loginUser);
app.post("/signup", createUser);

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const { createUser, login } = require("./controllers/users");
const app = express();
const auth = require("./middleware/auth");

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => console.log("db error", e),
);

const routes = require("./routes/index");

app.use(express.json());
app.use(auth);

app.post("/signin", login);
app.post("/signup", createUser);

app.use(routes);
app.use("/cards", require("./routes/cards"));

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);

  //app.js
  const cors = require("cors");

  app.use(cors());
});

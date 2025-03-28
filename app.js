const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const config = require("./config");
const authRoutes = require("./routes/user");
const blogRouter = require("./routes/post");


mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error"));

app.use(cors());
app.use(bodyParser.json());
app.get("/", async (req, res) => {
  res.send("the server is running");
});

app.use("/api/user", authRoutes);
app.use("/api/blog",  blogRouter);

app.listen(config.port, () => {
  console.log(`server started on port ${config.port}`);
});

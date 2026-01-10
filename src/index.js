const express = require("express");
const { connect } = require("mongoose");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const connectDB = require("./db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

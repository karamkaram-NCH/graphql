require("dotenv").config();
const express = require("express");

// config imports
const { connectDb } = require("./config/db");

// routers imports
const { mainRouter } = require("./routes/main.route");

// constants
const port = process.env.PORT || 3001;
const app = express();

app.use("/", mainRouter);

const start = async () => {
  try {
    await connectDb();
    app.listen(port);
    const link = `http://localhost:${port}/`;
    console.log(`Server is running at \x1b[36m%s\x1b[0m`, link);
  } catch (error) {
    console.log(error);
  }
};

start();

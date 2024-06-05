const mongoose = require("mongoose");

const connectDb = async () => {
  return await mongoose.connect(process.env.DB_URI, {
    dbName: "test",
  });
};

module.exports = { connectDb };
